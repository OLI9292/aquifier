import { Redirect } from 'react-router';
import queryString from 'query-string';
import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';

import { shouldRedirect } from '../../../Library/helpers'
import Level from './level';
import JumpTo from './jumpTo';

import { media } from '../../../Library/Styles/index';

class Train extends Component {
  constructor(props) {
    super(props);
    this.state = {
      levels: []
    };
  }

  componentDidMount() {
    this.loadLevels(this.props);
    this.loadImages();
  }

  loadImages() {
    let r = require.context('../../../Library/Images/DemoLevels', false, /\.(png|jpe?g|svg)$/);
    let images = {};
    r.keys().forEach((item, index) => { images[item.replace('./', '')] = r(item); });
    this.setState({ images });
  }

  componentWillReceiveProps(nextProps) {
    this.loadLevels(nextProps);
  }

  loadLevels(props) {
    if (props.levels && props.user && _.isEmpty(this.state.levels)) {
      const levels = this.formatLevels(props.levels, props.user.levels);
      this.setState({
        furthestLevel: levels.furthest,
        levels: levels.groupedByLadder 
      }); 
    }
  }

  formatLevels(allLevels, userLevels) {
    const completedLevels = _.filter(allLevels, level => {
      const uLvl = _.find(userLevels, ul => ul.id === level._id);
      return uLvl && (level.type === 'speed' || (uLvl.progress.length >= level.progressBars));
    });
    
    const completed = _.uniq(_.pluck(completedLevels, 'ladder')).sort();
    const open = completed.length ? completed.concat(_.last(completed) + 1) : [1];
    
    const furthest = _.last(open);
    const furthestLevel = _.find(allLevels, l => l.ladder === furthest);
        
    const groupedByLadder = _.groupBy(_.map(allLevels, level => {
      level.completed = _.contains(_.pluck(completedLevels, '_id'), level._id);
      level.locked = !_.contains(open, level.ladder);
      return level;
    }), level => `${level.ladder}${level.type === 'speed' ? '-speed' : ''}`);
    
    return {
      furthest: furthestLevel,
      groupedByLadder: groupedByLadder
    }
  }

  clickedLevelOverview(level, isExpanded) {
    if (!level.locked) {
      if (level.type === 'speed') {
        this.clickedLevelStage('speed', level._id);
      } else {
        const expanded = !isExpanded && level._id;
        this.setState({ expanded });        
      }
    }
  }

  clickedLevelStage(type, id, stage = 0) {
    const params = { type: type, id: id, stage: stage };
    this.setState({ redirect: '/play/' + queryString.stringify(params) });
  }  

  jumpTo(levelId) {
    document.getElementById(levelId).scrollIntoView({ behavior: 'smooth' });
  }

  imgSrc(level, images) {
    if (!images || !level) { return; }
    const imgKey = _.find(_.keys(images), k => k.includes(level.name.split(' ')[0]));
    return images[imgKey || 'default.png'];
  }

  ladders() {
    const ladders = _.uniq(_.pluck(_.flatten(_.values(this.state.levels)), 'ladder')).sort((a, b) => a - b);
    _.forEach(_.clone(ladders), num => {
      const speedKey = `${num}-speed`;
      const index = ladders.indexOf(num) + 1;
      const exists = _.contains(_.keys(this.state.levels), speedKey);
      if (exists) { ladders.splice(index, 0, speedKey); }
    })
    return ladders;
  }

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }

    const { session, user } = this.props;
    const { expanded, furthestLevel, images } = this.state;

    const levelComponents = (() => {
      const ladders = this.ladders();
      return _.map(ladders, ladder => {
        const levels = _.map(this.state.levels[ladder].slice(0,2), level => {
          const userLevel = _.find(user.levels, l => l.id === level._id);
          const userStages = userLevel ? userLevel.progress : [];
          const progress = level.type === 'speed'
            ? level.completed ? 1 : 0
            : userStages.length / level.progressBars;

          level.avgAcc = level.completed && 
            parseInt(
              parseFloat(_.reduce(userLevel.progress, (acc, curr) => acc + curr.bestAccuracy, 0) * 100) /
              parseFloat(Math.max(userLevel.progress.length, 0)), 10);
          level.bestScore = level.type === 'speed' && level.completed && userLevel.progress[0].bestScore;
          level.mastered = level.avgAcc === 100;
          
          if (level.type === 'speed') {
            const index = parseInt(_.filter(ladders, l => String(l).includes('speed')).indexOf(ladder), 0) + 1;
            level.name = 'speed ' + index;
          }

          const isExpanded = level._id === expanded;

          return <Level
            imgSrc={this.imgSrc(level, images)}
            clickedLevelStage={this.clickedLevelStage.bind(this)}
            clickedLevelOverview={this.clickedLevelOverview.bind(this)}
            progress={progress}
            isExpanded={isExpanded}
            key={level._id}
            level={level}
            session={session}
            userStages={userStages} />
        });
        
        return levels.length > 1
          ? <MultipleLevelContainer key={ladder}>
              {levels}
            </MultipleLevelContainer>
          : levels;
      })
    })();

    return (
      <Container>
        <JumpTo
          imgSrc={this.imgSrc(furthestLevel, images)}
          furthestLevel={furthestLevel}
          jumpTo={this.jumpTo.bind(this)} />
        {levelComponents}  
      </Container>
    );
  }
}

const Container = styled.div`
  padding: 20px 0px;
  text-align: center;
  ${media.phone`
    padding: 0;
    min-height: 80vh;
  `}; 
`

const MultipleLevelContainer = styled.div`
  display: flex;
  justify-content: space-around;
  height: 120px;
  align-items: center;
`

export default Train
