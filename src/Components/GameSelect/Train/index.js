import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';

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
      const userLevel = _.find(userLevels, ul => ul.id === level._id);
      return userLevel && userLevel.progress.length >= level.progressBars;
    });

    const openLadders = _.uniq(_.pluck(allLevels, 'ladder')).sort();
    const furthestLadder = _.last(openLadders);

    const furthestLevel = _.find(allLevels, l => l.ladder === furthestLadder);
    const groupedByLadder = _.groupBy(_.map(allLevels, level => {
      level.completed = _.contains(_.pluck(completedLevels, '_id'), level._id);
      level.locked = !_.contains(openLadders, level.ladder);
      return level;
    }), 'ladder');

    return {
      furthest: furthestLevel,
      groupedByLadder: groupedByLadder
    }
  }

  clickedLevelOverview(level, isExpanded) {
    if (!level.locked) {
      const expanded = !isExpanded && level._id;
      this.setState({ expanded });
    }
  }

  mouse(level, over = true) {
    const hovering = over && !level.locked && level._id;
    this.setState({ hovering });
  }  

  jumpTo(levelId) {
    document.getElementById(levelId).scrollIntoView({ behavior: 'smooth' });
  }

  render() {
    const { 
      session,
      user
    } = this.props;

    const {
      hovering,
      expanded,
      furthestLevel,
      images
    } = this.state;

    const imgSrc = level => {
      if (!images || !level) { return; }
      const imgKey = _.find(_.keys(images), k => k.includes(level.name.split(' ')[0]));
      return images[imgKey || 'default.png'];
    }

    const levelComponents = (() => {
      return _.map(_.keys(this.state.levels).sort(), ladder => {
        
        const levels = _.map(this.state.levels[ladder].slice(0,2), level => {
          const userLevel = _.find(user.levels, l => l.id === level._id);
          const userStages = userLevel ? userLevel.progress : [];

          const isExpanded = level._id === expanded;
          const isHovering = level._id === hovering;

          return <Level
            imgSrc={imgSrc(level)}
            clickedLevelOverview={this.clickedLevelOverview.bind(this)}
            isExpanded={isExpanded}
            isHovering={isHovering}
            key={level._id}
            level={level}
            mouse={this.mouse.bind(this)}
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
          imgSrc={imgSrc(furthestLevel)}
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
