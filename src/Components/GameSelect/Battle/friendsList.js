import _ from 'underscore';
import { connect } from 'react-redux'
import React, { Component } from 'react';

import { color, media } from '../../../Library/Styles/index';
import exitImg from '../../../Library/Images/exit-gray.png';

import {
  OnlineIndicator,
  Friend
} from './components';

import {
  fetchUsersAction,
} from '../../../Actions/index';

class FriendsList extends Component {
  componentDidMount() {
    const ids = this.props.friends.map(f => f.id);
    this.props.dispatch(fetchUsersAction(ids));
  }

  render() {
    const {
      onlineClientIds,
      opponents
    } = this.props;

    // Save isOnline to a var to avoid searching twice
    const row = data => {
      const isOnline = onlineClientIds.includes(data._id);

      return <Friend key={data.username}>
        <OnlineIndicator isOnline={isOnline} />

        <div
          onClick={() => this.props.challengeFriend(data)}
          style={{display:"flex",alignItems:"baseline",pointerEvents:isOnline ? "auto" : "none"}}>
        
          <p style={{margin:"0px 5px"}}>
            {data.username}
          </p>

          <p style={{color:color.red,margin:"0px 5px",fontSize:"0.85em"}}>
            {data.elo}
          </p>  

        </div>    

        <img
          onClick={() => this.removeFriend(data.id)}
          style={{width:"16px",height:"16px"}}
          src={exitImg} />

      </Friend>;
    }

    return (
      <div>  
        {_.map(opponents, row)}       
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  opponents: _.values(state.entities.opponent)
});

export default connect(mapStateToProps)(FriendsList);
