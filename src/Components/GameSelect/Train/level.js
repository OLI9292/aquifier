import React, { Component } from 'react';
import queryString from 'query-string';
import { Redirect } from 'react-router';
import _ from 'underscore';

import { color } from '../../../Library/Styles/index';
import { shouldRedirect } from '../../../Library/helpers'
import get from 'lodash/get'

import downArrow from '../../../Library/Images/icon-double-arrow.png';
import lockIcon from '../../../Library/Images/icon-lock.png';
import archer from '../../../Library/Images/archer-green.png';

import {
  DownArrow,
  Img,
  InfoIconContainer,
  InfoIcon,
  LevelButton,
  StageDetail,
  StagesContainer
} from './components';

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
      isExpanded,
      isHovering,
      level,
      userStages,
      imgSrc
    } = this.props;

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
              alt={'lock icon'}
              src={lockIcon} />
          )
        }[type]}
      </InfoIconContainer>
    }  

    const addStages = overview => {
      const completedIndices = _.pluck(userStages, 'stage');
      // const openIndices = _.map(completedIndices, s => s + 1).concat(1);
      const allIndices = _.range(1, level.progressBars + 1);

      return <div key={level._id}>
        {overview}
        <StagesContainer>
          {_.map(allIndices, n => {
            const key = level._id + '-' + n;
            const isHovering = this.state.hovering === key;
            const isLocked = false // !_.contains(openIndices, n);
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
                
                <Img alt={level.name} src={imgSrc} />
              </LevelButton>
              <StageDetail show={userStage || isHovering}>
                {userStage && !isHovering && <img alt={'archer icon'} src={archer} style={{height:'50%',width:'auto',marginRight:'5px'}} />}
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
          id={level._id}
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
            src={imgSrc}
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

export default Level
