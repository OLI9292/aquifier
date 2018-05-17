import _ from 'underscore';
import React, { Component } from 'react';

import { color, media } from '../../../Library/Styles/index';
import exitImg from '../../../Library/Images/exit-gray.png';
import Button from '../../Common/button';
import FriendList from './friendsList';

import {
  ModalContainer,
  OnlineIndicator,
  Friend
} from './components';

class AddFriends extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {
    return (
      <ModalContainer>
        <FriendList 
          challengeFriend={this.props.challengeFriend}
          onlineClientIds={this.props.onlineClientIds}
          friends={this.props.friends} />

        <Button.medium
          style={{backgroundColor:"white",color:color.mediumLGray,width:"300px"}}
          onClick={this.props.addFriends.bind(this)}>
          add friends
        </Button.medium>           
      </ModalContainer>
    );
  }
}

export default AddFriends;
