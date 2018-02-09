import queryString from 'query-string';
import { connect } from 'react-redux'
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';

import Header from '../Header/index';
import { color } from '../../Library/Styles/index';
import { shouldRedirect } from '../../Library/helpers';
import { fetchQuestions, fetchLevels, removeEntity } from '../../Actions/index';

import seed from './seed';
import Game from './game';

const VALID_GAMES = ['train', 'speed', 'demo'];

class GameManager extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
    this.hideZendesk();
    this.props.dispatch(removeEntity('questions'));    

    const settings = queryString.parse(this.props.settings);
    
    if (_.isEmpty(this.props.levels)) {
      this.props.dispatch(fetchLevels());
    }

    this.setState({ settings }, () => {
      if (this.props.session) {
        this.setState({ loading: true }, () => { this.loadGame(this.props.session.user); });  
      }        
    })
  } 

  componentWillReceiveProps(nextProps) {
    if (nextProps.session && !this.state.loading) {
      this.setState({ loading: true }, () => this.loadGame(nextProps.session.user));  
    } else if (nextProps.questions && nextProps.questions.length && !this.state.questions) {
      this.setState({ questions: nextProps.questions });
    } else if (nextProps.levels.length && !this.state.level) {
      const level = _.find(nextProps.levels, l => l._id === this.state.settings.id);
      level.fullname = level.name.toUpperCase() + ' ' + this.state.settings.stage;
      level.progress = [this.state.settings.stage, level.progressBars];
      if (level) { this.setState({ level }); }
    }
  }

  loadGame(userId) {
    const shouldSeed = true;
    const multiple = true;
    const spell = false;

    if (shouldSeed) {
      const questions = multiple ? seed : [seed[spell ? 1 : 0]];
      this.setState({ questions: questions, type: 'demo' })
    } else {
      const { id, type } = this.state.settings;
      if (id && _.contains(VALID_GAMES, type)) {
        this.setState({ type });
        const query = queryString.stringify(_.extend({}, this.state.settings, { user_id: userId }));
        this.props.dispatch(fetchQuestions(query));
      }
    }
  }

  hideZendesk() {
    // Zendesk doesn't show up in the DOM until a couple sec after the component mounts
    // there's probably a better solution, but this works
    this.interval = setInterval(() => {
      const elems = document.getElementsByClassName('zopim');
      if (elems.length === 2) {
        _.each(elems, e => e.style.display = 'none');
        clearInterval(this.interval);
      }
    }, 50);
  }  

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }  

    return (
      <div>
        <Game
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
