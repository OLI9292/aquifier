import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';

import { color } from '../../../Library/Styles/index';
import { shouldRedirect } from '../../../Library/helpers'
import get from 'lodash/get'

import downArrow from '../../../Library/Images/icon-double-arrow.png';
import lockIcon from '../../../Library/Images/icon-lock.png';
import archer from '../../../Library/Images/archer-green.png';

class Level extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  clickedLevelStage(id, stage) {
    const params = { type: 'train', id: id, stage: stage };
    this.setState({ redirect: '/play/' + queryString.stringify(params) });
  }

  formatAccuracy(stage) {
    const acc = get(stage, 'bestAccuracy')
    return acc ? `${Math.round(acc * 100)}%` : '100%';
  }

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }

    const {
      isCompleted,
      isExpanded,
      isHovering,
      level,
      userStages
    } = this.props;

    const levelImg = require(`../../../Library/Images/DemoLevels/${level.name.split(' ')[0]}.jpg`); 

    const infoIcon = (type, data, completed, isHovering) => {
      const bColor = {
        'index': (completed || isHovering) ? color.green : color.lightGray,
        'lock': color.lightGray
      }[type];
      return <InfoIconContainer color={bColor}>
        {{
          'index': (
            <p style={{color:color[(completed || isHovering) ? 'white' : 'gray'],transition:'100ms'}}>
              {data}
            </p>
          ),
          'lock': (
            <InfoIcon
              src={lockIcon} />
          )
        }[type]}
      </InfoIconContainer>
    }  

    const addStages = overview => {
      const completedIndices = _.pluck(userStages, 'stage');
      const openIndices = _.map(completedIndices, s => s + 1).concat(1);
      const allIndices = _.range(1, level.progressBars + 1);

      return <div key={level._id}>
        {overview}
        <StagesContainer>
          {_.map(allIndices, n => {
            const key = level._id + '-' + n;
            const isHovering = this.state.hovering === key;
            const isLocked = !_.contains(openIndices, n);
            const completed = _.contains(completedIndices, n);
            const userStage = _.find(userStages, s => s.stage === n);

            return <div key={key}>
              <LevelButton
                small
                isLocked={isLocked}
                bColor={completed || isHovering ? 'green' : 'lightGray'}
                onClick={() => this.clickedLevelStage(level._id, n)}
                onMouseOver={() => { if (!isLocked) { this.setState({ hovering: key }); }}}
                onMouseLeave={() => this.setState({ hovering: undefined })}>
                
                {infoIcon(isLocked ? 'lock' : 'index', n, completed, isHovering)}
                
                <Img src={levelImg} />
              </LevelButton>
              <StageDetail show={userStage || isHovering}>
                {userStage && !isHovering && <img src={archer} style={{height:'50%',width:'auto',marginRight:'5px'}} />}
                <p>
                  {isHovering ? 'Play!' : this.formatAccuracy(userStage)}
                </p>
              </StageDetail>
            </div>
          })}
        </StagesContainer>
      </div>  
    }

    const levelOverview = () => {
      return <div style={{margin:'50px 0px',height:'120px'}}>
        <LevelButton
          isLocked={level.locked}
          bColor={level.locked ? 'lightGray' : (level.completed || isExpanded || isHovering) ? 'green' : 'lightGray'}
          isHovering={isHovering}
          onClick={() => this.props.clickedLevelOverview(level, isExpanded)}
          onMouseOver={() => this.props.mouse(level)}
          onMouseLeave={() => this.props.mouse(level, false)}>

          {level.locked && infoIcon('lock')}

          <DownArrow 
            src={downArrow}
            isExpanded={isExpanded}
            isHovering={isHovering} />

          <Img 
            src={levelImg}
            opaque={level.locked} />
        </LevelButton>

        <p style={{lineHeight:'0px'}}>
          {level.name.toUpperCase()}
        </p>
      </div>
    }

    return (
      <div>
        {isExpanded ? addStages(levelOverview()) : levelOverview()}
      </div>
    );
  }
}

const DownArrow = styled.img`
  position: absolute;
  height: 25px;
  right: 0;
  margin-right: -40px;
  opacity: ${props => props.isHovering ? 1 : 0};
  transition: opacity 100ms;
  transform: rotate(${props => props.isExpanded ? 180 : 0}deg);
`

const Img = styled.img`
  opacity: ${props => props.opaque ? 0.25 : 1};
  max-height: 70%;
  max-width: 70%;
  width: auto;
  height: auto;
`

const InfoIconContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 40;
  margin-top: -5px;
  margin-right: -5px;
  height: 30px;
  width: 30px;
  border-radius: 20px;
  transition: 100ms;
  font-family: BrandonGrotesqueBold;
  background-color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
`

const InfoIcon = styled.img`
  width: 13px;
  height: auto;
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
  border: ${props => `4px solid ${color[props.bColor]}`};
  cursor: ${props => props.isLocked ? 'default' : 'pointer'};
  transition: 100ms;
`

const StageDetail = styled.div`
  opacity: ${props => props.show ? 1 : 0};
  color: ${color.green};
  transition: opacity 100ms;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin-top: -5px;
  padding-bottom: 10px;
`

const StagesContainer = styled.div`
  height: ${props => props.height};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export default Level
