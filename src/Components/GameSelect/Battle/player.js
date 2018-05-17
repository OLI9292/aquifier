import _ from 'underscore';
import React, { Component } from 'react';

import { color, media } from '../../../Library/Styles/index';
import exitImg from '../../../Library/Images/exit-gray.png';

import {
  PlayerContainer,
  OnlineIndicator
} from './components';

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <PlayerContainer>
        <OnlineIndicator
          isOnline={isOnline} />
        
        <p
          style={{pointerEvents:isOnline ? "auto" : "none"}} 
          onClick={() => this.props.challengeFriend(data)}>
          {data.username}
        </p>

        <img
          onClick={() => this.removeFriend(data.id)}
          style={{width:"16px",height:"16px"}}
          src={exitImg} />      
      </PlayerContainer>
    );
  }
}

export default Player;
