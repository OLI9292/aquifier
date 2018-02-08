import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';

import Textarea from '../Common/textarea';
import { color } from '../../Library/Styles/index';
import { lighten10 } from '../../Library/helpers';
import { shouldRedirect } from '../../Library/helpers'

import whale from '../../Library/Images/whale.png';

class Train extends Component {
  constructor(props) {
    super(props);
    this.state = {
      levels: []
    };
  }

  componentDidMount() {
    this.loadLevels(this.props.levels)
  }

  componentWillReceiveProps(nextProps) {
    this.loadLevels(nextProps.levels)
  }

  loadLevels(levels) {
    if (levels && _.isEmpty(this.state.levels)) {
      this.setState({ levels: this.formatLevels(levels, []) }); 
    }
  }

  formatLevels(allLevels, userLevels = []) {
    return _.groupBy(_.map(allLevels, l => {
      const userProgress = _.find(userLevels, ul => ul.id === l._id);
      if (userProgress || l.isDemo) { l.userProgress = (userProgress || {}) };
      return l;
    }), 'ladder');
  }

  expanded(level) {
    this.setState({ expandNow: false, expanded: level._id }, () => {
      setTimeout(() => { this.setState({ expandNow: true}) }, 50);
    });
  }

  handleClick(level) {
    const [id, stage] = level._id.split('-');

    if (level.progressBars === 1) {
      this.setState({ redirect: '/play/' + queryString.stringify({ type: 'train', id: id, stage: 1 }) });
    } else if (stage) {
      this.setState({ redirect: '/play/' + queryString.stringify({ type: 'train', id: id, stage: stage }) });
    } else {
      this.expanded(level);
    }
  }

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }

    const levelButton = level => {      
      if (level._id === this.state.expanded) {
        return <LevelContainer expand={this.state.expandNow} key={level._id} count={level.progressBars}>
          {_.map(_.range(1, level.progressBars + 1), n => {
            return levelButton(_.extend({}, level, { _id: `${level._id}-${n}`, name: `${level.name} ${n}` }));
          })}
        </LevelContainer>
      } else {
        const isLocked = _.isUndefined(level.userProgress);
        return <Level key={level._id}>
          <LevelButton
            onClick={() => this.handleClick(level)}>
            <Img 
              blur={isLocked}
              src={whale} />
          </LevelButton>
          <p style={{lineHeight:'0px'}}>
            {level.name.toUpperCase()}
          </p>
        </Level>
      }
    }

    const levelButtons = (() => {
      return _.map(_.keys(this.state.levels).sort(), ladder => {
        const levels = this.state.levels[ladder];
        const expanded = _.contains(_.pluck(levels, '_id'), this.state.expanded);
        return levels.length > 1
          ? <MultiLevel key={ladder}>
              {levels.slice(0,2).map(levelButton)}
            </MultiLevel>
          : levelButton(levels[0]);
      })
    })();

    return (
      <Container>
        {levelButtons}  
      </Container>
    );
  }
}

const Img = styled.img`
  -webkit-filter: ${props => `blur(${props.blur ? 1 : 0}px)`};
  height: 50%;
  width: auto;
`

const Container = styled.div`
  padding: 20px 0px;
  text-align: center;
`

const MultiLevel = styled.div`
  display: flex;
  justify-content: space-around;
  height: 120px;
  align-items: center;
`

const LevelContainer = styled.div`
  max-height: ${props => props.expand ? `${props.count * 150}px` : '150px'};
  transition: max-height 0.5s ease-in;
  background-color: white;
  overflow: hidden;
`

const Level = styled.div`
  margin: 30px 0px;
  height: 120px;
`

const LevelButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  width: 80px;
  border-radius: 50px;
  margin: 0 auto;
  border: 4px solid ${color.lightBlue};
  cursor: pointer;
`

export default Train
