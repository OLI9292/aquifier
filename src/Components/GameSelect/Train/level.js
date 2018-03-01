import React, { Component } from 'react';
import _ from 'underscore';
import CircularProgressbar from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { color } from '../../../Library/Styles/index';
import get from 'lodash/get'

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
    const acc = get(stage, 'bestAccuracy')
    return acc ? `${Math.round(acc * 100)}%` : '100%';
  }

  render() {
    const {
      isExpanded,
      level,
      userStages,
      imgSrc,
      progress
    } = this.props;

    const infoIcon = (type, data, completed) => {
      const bColor = {
        'index': completed ? color.green : color.lightGray,
        'lock': color.lightGray
      }[type];
      return <InfoIconContainer color={bColor}>
        {{
          'index': (
            <p style={{color:color[completed ? 'white' : 'gray'],transition:'100ms'}}>
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
                
                {infoIcon(isLocked ? 'lock' : 'index', n, completed)}
                
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
      const percentage = this.props.progress ? (this.props.progress * 100) : 0;
      const stroke = percentage === 100 ? color.green : color.mainBlue;
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
          bColor={level.locked ? 'lightGray' : (level.completed || isExpanded) ? 'green' : 'lightGray'}
          onClick={() => this.props.clickedLevelOverview(level, isExpanded)}>

          {level.locked && infoIcon('lock')}

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
