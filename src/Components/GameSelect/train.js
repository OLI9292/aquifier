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

  clickedLevel(id, stage) {
    this.setState({ redirect: '/play/' + queryString.stringify({ type: 'train', id: id, stage: stage }) });
  }

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }

    const addStages = (overview, level) => {
      return <div>
        {overview}
        <StagesContainer height={`${level.progressBars * 100}px`}>
          {_.map(_.range(1, level.progressBars + 1), n => {
            return <div>
              <LevelButton small isExpanded onClick={() => this.clickedLevel(level._id, n)}>
                <StageIndex>{n}</StageIndex>
                <Img 
                  src={require(`../../Library/Images/DemoLevels/${level.name.split(' ')[0]}.jpg`)} />
              </LevelButton>
            </div>
          })}
        </StagesContainer>
      </div>      
    }

    const levelComponent = level => {      
      const isExpanded = level._id === this.state.expanded;
      const isLocked = _.isUndefined(level.userProgress);

      const LevelOverview = <div style={{margin:'50px 0px',height:'120px'}} key={level._id}>
        <LevelButton
          isExpanded={isExpanded}
          onClick={() => this.expanded(level)}>
          <Img 
            blur={isLocked}
            src={require(`../../Library/Images/DemoLevels/${level.name.split(' ')[0]}.jpg`)} />
        </LevelButton>
        <p style={{lineHeight:'0px'}}>
          {level.name.toUpperCase()}
        </p>
      </div>

      return isExpanded
        ? addStages(LevelOverview, level)
        : LevelOverview;
    }

    const levelComponents = (() => {
      return _.map(_.keys(this.state.levels).sort(), ladder => {
        const levels = this.state.levels[ladder];
        const expanded = _.contains(_.pluck(levels, '_id'), this.state.expanded);
        return levels.length > 1
          ? <MultiLevel key={ladder}>
              {levels.slice(0,2).map(levelComponent)}
            </MultiLevel>
          : levelComponent(levels[0]);
      })
    })();

    return (
      <Container>
        {levelComponents}  
      </Container>
    );
  }
}

const Img = styled.img`
  -webkit-filter: ${props => `blur(${props.blur ? 1 : 0}px)`};
  max-height: 70%;
  max-width: 70%;
  width: auto;
  height: auto;
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

const StageIndex = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 40;
  margin-top: -5px;
  margin-right: -5px;
  height: 25px;
  width: 25px;
  border-radius: 20px;
  font-family: BrandonGrotesqueBold;
  color: white;
  background-color: ${color.green};
`

const StagesContainer = styled.div`
  height: ${props => props.height};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const LevelButton = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${props => `${props.small ? 70 : 100}px`};
  width: ${props => `${props.small ? 70 : 100}px`};
  border-radius: 60px;
  margin: 0 auto;
  border: ${props => `4px solid ${color[props.isExpanded ? 'green': 'lightBlue']}`};
  cursor: pointer;
`

export default Train
