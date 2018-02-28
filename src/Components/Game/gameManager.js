import queryString from 'query-string';
import Firebase from '../../Networking/Firebase';
import { connect } from 'react-redux'
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import _ from 'underscore';
import get from 'lodash/get';

import { shouldRedirect } from '../../Library/helpers';
import { fetchQuestions, fetchLevels, removeEntity, saveLevel } from '../../Actions/index';

import Game from './game';

const VALID_GAMES = ['train', 'speed', 'explore', 'multiplayer'];

class GameManager extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
    this.hideZendesk();
    this.props.dispatch(removeEntity('questions'));    

    const { user, levels } = this.props;
    const settings = queryString.parse(this.props.settings);
    const pauseMatch = settings.type === 'multiplayer';

    if (!levels.length) { this.props.dispatch(fetchLevels()); }

    this.setState({
      settings: settings,
      type: settings.type,
      pauseMatch: pauseMatch 
    }, () => {
      if (user) { this.setState({ loading: true }, () => { this.setupGame(user); }); }        
    })
  } 

  componentWillUnmount() {
    const { settings, gameOver } = this.state;
    if (settings.type === 'multiplayer' && !gameOver) {
      const username = this.username(this.props.user);
      Firebase.refs.games.child(settings.id).child('players').child(username).remove();
    }
  }  

  componentWillReceiveProps(nextProps) {
    if (nextProps.user && !this.state.loading) {
      this.setState({ loading: true }, () => this.setupGame(nextProps.user));  
    } else if (nextProps.questions.length && !this.state.questions) {
      this.setState({ questions: nextProps.questions });
    } else if (nextProps.levels.length && !this.state.level) {
      this.setLevelName(nextProps, this.state.settings);
    }
  }

  setLevelName(props, settings) {
    const level = _.find(props.levels, l => l._id === settings.id);
    let time
    if (!level) { return; }

    if (settings.type === 'train') {
      level.fullname = level.name.toUpperCase() + ' ' + settings.stage;
      level.progress = [settings.stage, level.progressBars];      
    } else if (_.contains(['explore', 'speed'], settings.type)) {
      level.fullname = level.slug.replace('-', ' ').toUpperCase();
      level.time = get(level.speed, 'time') || 3;
    }

    this.setState({ level: level, time: time });
  }

  gameOver(accuracy, score, time) {
    this.setState({ gameOver: true });
    const { settings, type } = this.state;

    if (type === 'train') {
      const levelId = settings.id;
      const stage = parseInt(settings.stage, 10);
      const userId = this.props.session.user;
      const data = {
        accuracy: accuracy,
        levelId: levelId,
        score: score,
        stage: stage,
        time: time,
      };      
      this.props.dispatch(saveLevel(data, userId));
      this.setState({ redirect: '/home' });      
    } else if (type === 'multiplayer') {
      const username = this.username(this.props.user);
      Firebase.refs.games.child(settings.id).child('players').child(username).set(score);
      const redirect = '/leaderboard/' + settings.id;
      this.setState({ redirect });       
    }
  }

  setupGame(user) {
    const { settings } = this.state;

    if (settings.type === 'multiplayer') {
      this.joinGame(settings, user);
    } else {
      const params = _.extend({}, settings, { user_id: user._id });
      this.loadQuestions(params);
    }
  }

  loadQuestions(params) {
    if (params && !this.state.loadingQuestions) {
      this.setState({ loadingQuestions: true }, () => {
        const query = queryString.stringify(params);
        this.props.dispatch(fetchQuestions(query));      
      });
    }
  }

  username(user) {
    return `${get(user, 'firstName')} ${get(user, 'lastName')}`;
  }

  joinGame = async (settings, user) => {
    const accessCode = settings.id;
    const name = this.username(user);
    await Firebase.joinGame(name, accessCode);

    Firebase.refs.games.child(accessCode).on('value', (snap) => {
      const { players, end } = snap.val();
      const seed = snap.val().words;
      const params = seed && { user_id: user._id, seed: seed, type: 'multiplayer' };
      this.loadQuestions(params);
      
      const kicked = !_.includes(_.keys(players), name);
      const gameStarted = snap.val().status === 1;

      if (kicked) {
        this.setState({ redirect: '/home' }); 
      } else if (gameStarted) {
        this.setState({ pauseMatch: false, end: end });
      }
    });    
  }

  hideZendesk() {
    this.interval = setInterval(() => {
      const zendesk = window.$zopim.livechat;
      if (zendesk) {
        zendesk.hideAll();
        clearInterval(this.interval);
      }
    }, 50);
  }  

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }  

    return (
      <div>
        <Game
          gameOver={this.gameOver.bind(this)}
          level={this.state.level}
          end={this.state.end}
          time={this.state.time}
          type={this.state.type}
          pauseMatch={this.state.pauseMatch}
          questions={this.state.questions}
          originalQuestions={this.state.questions} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  session: state.entities.session,
  user: _.first(_.values(state.entities.user)),
  questions: _.values(state.entities.questions),
  levels: _.values(state.entities.levels)  
});

export default connect(mapStateToProps)(GameManager)
