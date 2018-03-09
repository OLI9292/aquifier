import React, { Component } from 'react';
import _ from 'underscore';
import CircularProgressbar from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { color } from '../../../Library/Styles/index';
import get from 'lodash/get'

import badgeIcon from '../../../Library/Images/icon-badge-yellow.png';
import lockIcon from '../../../Library/Images/icon-lock.png';
import archer from '../../../Library/Images/archer-green.png';

import {
  Img,
  InfoIconContainer,
  InfoIcon,
  LevelButton,
  RadialProgressContainer,
  StageDetail,
  StagesContainer
} from './components';

class Level extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  formatAccuracy(stage) {
    const acc = get(stage, 'bestAccuracy') || 0
    return `${Math.round(acc * 100)}%`;
  }

  render() {
    const {
      isExpanded,
      level,
      userStages,
      imgSrc,
      progress
    } = this.props;

    const infoIcon = (type, data, completed, large = true) => {
      const bColor = {
        'avgAcc': color.green,
        'index': completed ? color.green : color.lightGray,
        'lock': color.lightGray,
        'badge': color.green,
        'bestScore': color.red
      }[type];
      return <InfoIconContainer large={large} color={bColor}>
        {{
          'avgAcc': (
            <p style={{color:'white'}}>
              {data + '%'}
            </p>
          ),
          'index': (
            <p style={{color:color[completed ? 'white' : 'gray'],transition:'100ms'}}>
              {data}
            </p>
          ),
          'lock': (
            <InfoIcon
              large={large}
              alt={'lock icon'}
              src={lockIcon} />
          ),
          'badge': (
            <InfoIcon
              large={large}
              alt={'badge icon'}
              src={badgeIcon} />
          ),
          'bestScore': (
            <p style={{color:'white'}}>
              {data}
            </p>
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
            const isLocked = !_.contains(openIndices, n);
            const completed = _.contains(completedIndices, n);
            const userStage = _.find(userStages, s => s.stage === n);

            return <div key={key}>
              <LevelButton
                small
                isLocked={isLocked}
                bColor={completed ? 'green' : 'lightGray'}
                onClick={() => { if (!isLocked) { this.props.clickedLevelStage('train', level._id, n) }}}>
                
                {infoIcon(isLocked ? 'lock' : 'index', n, completed, false)}
                
                <Img alt={level.name} src={imgSrc} />
              </LevelButton>

              <StageDetail show={userStage}>
                {userStage && 
                  <img
                    alt={'archer icon'}
                    src={archer}
                    style={{height:'50%',width:'auto',marginRight:'5px'}} />}
                <p>
                  {this.formatAccuracy(userStage)}
                </p>
              </StageDetail>
            </div>
          })}
        </StagesContainer>
      </div>  
    }

    const withProgress = img => {
      const { progress, level } = this.props;
      const percentage = progress ? (progress * 100) : 0;
      const stroke = level.type === 'speed'
        ? color.red
        : percentage === 100 ? color.green : color.mainBlue;
      return <RadialProgressContainer>
        {img}
        <div style={{position:'absolute',width:'100px',height:'100px'}}>
          <CircularProgressbar
            strokeWidth={4}
            styles={{path: { stroke: stroke }}}
            percentage={percentage}
            textForPercentage={null}
          />
        </div>
      </RadialProgressContainer>
    }

    const levelOverview = () => {
      const img = <Img src={imgSrc} opaque={level.locked} />

      return <div style={{margin:'50px 0px',height:'120px'}}>
        <LevelButton
          progress={progress}
          id={level._id}
          isLocked={level.locked}
          isCompleted={level.completed}
          bColor={level.locked ? 'lightGray' : (level.completed || isExpanded) ? 'green' : 'lightGray'}
          onClick={() => this.props.clickedLevelOverview(level, isExpanded)}>

          {level.locked && infoIcon('lock')}
          {level.type === 'train' && level.completed && (level.mastered ? infoIcon('badge') : infoIcon('avgAcc', level.avgAcc))}
          {level.type === 'speed' && level.completed && infoIcon('bestScore', level.bestScore)}
          {withProgress(img)}
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
