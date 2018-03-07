import moment from 'moment';
import queryString from 'query-string';
import Firebase from '../../Networking/Firebase';
import { connect } from 'react-redux'
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import _ from 'underscore';
import get from 'lodash/get';

import { shouldRedirect, mobileCheck } from '../../Library/helpers';

import {
  fetchQuestionsAction,
  fetchLevelsAction,
  removeEntityAction,
  saveStatsAction,
  saveLevelAction,
  saveQuestionAction
} from '../../Actions/index';

import Game from './game';

class GameManager extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
    this.hideZendesk();
    this.props.dispatch(removeEntityAction('questions'));    

    const { user, levels } = this.props;
    const settings = queryString.parse(this.props.settings);
    const pauseMatch = settings.type === 'multiplayer';

    if (!levels.length) { this.props.dispatch(fetchLevelsAction()); }

    this.setState({
      settings: settings,
      type: settings.type,
      pauseMatch: pauseMatch 
    }, () => {
      if (settings.type === 'demo') { this.setState({ loading: true }, () => { this.setupGame(); }); }
      else if (user)                { this.setState({ loading: true }, () => { this.setupGame(user); }); }        
    })
  } 

  componentWillUnmount() {
    const { settings, gameOver, stats } = this.state;
    const { session, user } = this.props;

    if (settings.type === 'multiplayer' && !gameOver) {
      this.exitMultiplayerGame(settings.id, user);
    }

    if (settings.type !== 'demo') {
      this.saveStats(session, stats);
    }
  }  

  exitMultiplayerGame(accessCode, user) {
    Firebase.refs.games.child(accessCode).child('players').child(this.username(user)).remove();
  }

  componentWillReceiveProps(nextProps) {
    const {
      level,
      loading,
      questions,
      settings
    } = this.state;

    if (nextProps.user && !loading) {
      this.setState({ loading: true }, () => this.setupGame(nextProps.user));  
    }
    if (nextProps.questions.length && !questions) {
      this.setState({ questions: nextProps.questions });
    }
    if (nextProps.levels.length && !level && settings) {
      this.setLevelName(nextProps, settings);
    }
  }

  recordQuestion(question, correct, timeSpent, gameState) {
    const answeredAt = moment().format();
    const mobile = mobileCheck();
    const { hintCount, incorrectGuesses } = gameState;
    const { word, type } = question;    
    const userId = get(this.props.session, 'user');
    const sessionId = get(this.props.session, 'sessionId');

    const data = { answered_at: answeredAt, answers: null, choices: null, correct: correct,
      mobile: mobile, hints_used: hintCount, incorrect_guesses: incorrectGuesses,
      session_id: sessionId, time_spent: timeSpent, type: type, user_id: userId, word: word };

    this.props.dispatch(saveQuestionAction(data));

    const stat = { word: word, correct: correct, difficulty: type, time: timeSpent };
    const stats = (this.state.stats || []).concat(stat);
    this.setState({ stats });
  }

  saveStats(session, stats) {
    const params = { id: get(session, 'user'), stats: stats, platform: 'web' };
    this.props.dispatch(saveStatsAction(params, session));
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
      time = parseInt(get(level.speed, 'time') || 3, 10);
    }

    this.setState({ level: level, time: time });
  }

  gameOver(accuracy, score, time) {
    const { settings, type } = this.state;

    // Return to home screen if demo
    if (type === 'demo') {
      this.setState({ redirect: '/' });
      return;
    }

    this.setState({ gameOver: true });

    // Save data and return to user home if train
    if (type === 'train') {
      const levelId = settings.id;
      const stage = parseInt(settings.stage, 10);
      const userId = this.props.session.user;
      const data = {
        accuracy: accuracy,
        levelId: levelId,
        score: score,
        stage: stage,
        time: time
      };      
      this.props.dispatch(saveLevelAction(data, userId));
      this.setState({ redirect: '/home' });      
    }

    // Save score and redirect to leaderboard if multiplayer
    if (type === 'multiplayer') {
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
    } else if (settings.type === 'demo') {
      this.loadQuestions({ type: settings.type });
    } else {
      const params = _.extend({}, settings, { user_id: user._id });
      this.loadQuestions(params);
    }
  }

  loadQuestions(params) {
    if (params && !this.state.loadingQuestions) {
      this.setState({ loadingQuestions: true }, () => {
        const query = queryString.stringify(params);
        this.props.dispatch(fetchQuestionsAction(query));      
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
          recordQuestion={this.recordQuestion.bind(this)}
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
