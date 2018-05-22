import React, { Component } from 'react';

import { color } from '../../../Library/Styles/index';
import Button from '../../Common/button';
import FriendList from './friendsList';
import Header from '../../Common/header';
import exitImg from '../../../Library/Images/exit-gray.png';

import {
  ModalContainer
} from './components';

class ChallengeFriends extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <ModalContainer>
        <img
          onClick={this.props.exitModal.bind(this)}
          style={{width:"25px",height:"25px",float:"right",padding:"20px",cursor:"pointer"}}
          alt={"exit"}
          src={exitImg} />

        <Header.medium
          style={{color:color.mediumLGray,fontFamily:"BrandonGrotesque",margin:"75px 0px 25px 0px"}}>
          friends
        </Header.medium>

        <FriendList 
          removeFriend={this.props.removeFriend}
          tappedFriend={this.props.challengeFriend}
          onlineClientIds={this.props.onlineClientIds} />

        <Button.medium
          style={{backgroundColor:"white",color:color.mediumLGray,width:"300px",marginTop:"10px"}}
          onClick={this.props.addFriends.bind(this)}>
          add friends
        </Button.medium>   
      </ModalContainer>
    );
  }
}

export default ChallengeFriends;
