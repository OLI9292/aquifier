import _ from 'underscore';
import { connect } from 'react-redux'
import React, { Component } from 'react';

import { color } from '../../../Library/Styles/index';
import exitImg from '../../../Library/Images/exit-gray.png';

import {
  OnlineIndicator,
  Friend
} from './components';

import {
  fetchUsersAction,
  removeEntityAction,
  updateEntityAction
} from '../../../Actions/index';

class FriendsList extends Component {
  componentDidMount() {
    if (this.props.isAdding) {
      this.props.dispatch(removeEntityAction("friends"))
    } else {
      this.fetchUsersFriends(this.props.user.friends);      
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search === this.props.search) { return; }
    this.fetchUsersWithUsernameStartingWith(nextProps.search);
  }  

  fetchUsersFriends(friends) {
    const ids = friends.map(f => f.id);
    if (ids.length === 0) { return; }
    const query = `ids=${ids.join(',')}`;
    this.props.dispatch(fetchUsersAction(query));    
  }

  fetchUsersWithUsernameStartingWith(str) {
    const query = `startsWith=${str}`;
    this.props.dispatch(fetchUsersAction(query));
  }

  removeFriend(id) {
    this.props.removeFriend(id);
    const updated = this.props.friends.filter(f => f._id !== id);
    this.props.dispatch(updateEntityAction({ friends: updated }));
  }

  render() {
    // Save isOnline to a var to avoid searching twice
    const row = data => {
      const isOnline = this.props.onlineClientIds.includes(data._id);

      return <Friend key={data.username}>
        <OnlineIndicator isOnline={isOnline} />

        <div
          onClick={() => this.props.tappedFriend(data)}
          style={{display:"flex",alignItems:"baseline",pointerEvents:isOnline ? "auto" : "none"}}>
        
          <p style={{margin:"0px 5px"}}>
            {data.username}
          </p>

          <p style={{color:color.red,margin:"0px 5px",fontSize:"0.85em"}}>
            {data.elo}
          </p>  

        </div>    

        <img
          onClick={() => this.removeFriend(data._id)}
          style={{width:"16px",height:"16px",visibility:this.props.isAdding ? "hidden" : "visible"}}
          alt={"exit"}
          src={exitImg} />
      </Friend>;
    }

    return (
      <div style={{margin:"20px 0px"}}>  
        {_.map(this.props.friends, row)}       
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  user: _.first(_.values(state.entities.user)),
  friends: _.values(state.entities.friends)
});

export default connect(mapStateToProps)(FriendsList);
