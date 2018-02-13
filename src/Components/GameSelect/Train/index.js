import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';

import Level from './level';

class Train extends Component {
  constructor(props) {
    super(props);
    this.state = {
      levels: []
    };
  }

  componentDidMount() {
    this.loadLevels(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.loadLevels(nextProps)
  }

  loadLevels(props) {
    if (props.levels && props.user && _.isEmpty(this.state.levels)) {
      const levels = this.formatLevels(props.levels, props.user.levels);
      this.setState({ levels }); 
    }
  }

  formatLevels(allLevels, userLevels) {
    const completedLevels = _.filter(allLevels, level => {
      const userLevel = _.find(userLevels, ul => ul.id === level._id);
      return userLevel && userLevel.progress.length >= level.progressBars;
    });

    const completedLadders = _.uniq(_.pluck(completedLevels, 'ladder')).sort();
    const openLadders = completedLadders.concat((_.last(completedLadders) || 0) + 1);
    console.log(completedLadders, openLadders)

    return _.groupBy(_.map(allLevels, level => {
      level.completed = _.contains(_.pluck(completedLevels, '_id'), level._id);
      level.locked = !_.contains(openLadders, level.ladder);
      return level;
    }), 'ladder');
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

  render() {
    const { 
      user
    } = this.props;

    const levelComponents = (() => {
      return _.map(_.keys(this.state.levels).sort(), ladder => {
        
        const levels = _.map(this.state.levels[ladder].slice(0,2), level => {
          const userLevel = _.find(user.levels, l => l.id === level._id);
          const userStages = userLevel ? userLevel.progress : [];

          const isExpanded = level._id === this.state.expanded;
          const isHovering = level._id === this.state.hovering;

          return <Level
            clickedLevelOverview={this.clickedLevelOverview.bind(this)}
            isExpanded={isExpanded}
            isHovering={isHovering}
            key={level._id}
            level={level}
            mouse={this.mouse.bind(this)}
            session={this.props.session}
            userStages={userStages} />
        });
        
        return levels.length > 1
          ? <div key={ladder}
              style={{display:'flex',justifyContent:'space-around',height:'120px',alignItems:'center'}}>
              {levels}
            </div>
          : levels;
      })
    })();

    return (
      <div style={{padding:'20px 0px', textAlign:'center'}}>
        {levelComponents}  
      </div>
    );
  }
}

export default Train
