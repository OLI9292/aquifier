import queryString from 'query-string';
import { connect } from 'react-redux'
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import _ from 'underscore';
import get from 'lodash/get';

import { shouldRedirect } from '../../Library/helpers';
import { fetchQuestions, fetchLevels, removeEntity, saveLevel } from '../../Actions/index';

import Game from './game';

const VALID_GAMES = ['train', 'speed', 'explore', 'read'];

class GameManager extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
    this.hideZendesk();
    this.props.dispatch(removeEntity('questions'));    

    const { session, levels, settings } = this.props;

    if (!levels.length) { this.props.dispatch(fetchLevels()); }

    this.setState({ settings: queryString.parse(settings) }, () => {
      if (session) { this.setState({ loading: true }, () => { this.loadGame(session.user); }); }        
    })
  } 

  componentWillReceiveProps(nextProps) {
    if (nextProps.session && !this.state.loading) {
      this.setState({ loading: true }, () => this.loadGame(nextProps.session.user));  
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
    const levelId = this.state.settings.id;
    const stage = parseInt(this.state.settings.stage, 10);
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
  }

  loadGame(userId) {
    const type = this.state.settings.type;
    if (_.contains(VALID_GAMES, type)) {
      this.setState({ type });
      const query = queryString.stringify(_.extend({}, this.state.settings, { user_id: userId }));
      this.props.dispatch(fetchQuestions(query));
    }
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
          type={this.state.type}
          questions={this.state.questions} />
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
