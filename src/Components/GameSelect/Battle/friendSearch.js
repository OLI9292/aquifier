import _ from 'underscore';
import React, { Component } from 'react';

import InputStyles from '../../Common/inputStyles';
import Header from '../../Common/header';
import exitImg from '../../../Library/Images/exit-gray.png';
import magnifyingGlassImg from '../../../Library/Images/magnifying-glass.png';
import { color } from '../../../Library/Styles/index';
import FriendList from './friendsList';

import {
  ModalContainer,
  searching
} from './components';

class FriendSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  search(e) {
    clearInterval(this.timeout);
    const startsWith = e.target.value;
    this.setState({ startsWith });
    if (!startsWith || startsWith.length < 4) { return; }
    this.timeout = setTimeout(() => this.setState({ search: startsWith, startsWith: null }), 2000);    
  }

  render() {
    const searchingUI = <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
      {searching}
      <p style={{color:color.mediumLGray,marginLeft:"10px"}}>
        {`Searching for "${this.state.startsWith}"`}
      </p>
    </div>;

    return (
      <ModalContainer>
        <img
          onClick={this.props.exitModal.bind(this)}
          style={{width:"25px",height:"25px",float:"right",padding:"20px",cursor:"pointer"}}
          alt={"exit"}
          src={exitImg} />

        <Header.medium
          style={{color:color.mediumLGray,fontFamily:"BrandonGrotesque",margin:"75px 0px 25px 0px"}}>
          add friends
        </Header.medium>

        <div>
          <img
            style={{width:"25px",height:"25px",position:"absolute",float:"left",margin:"20px 0px 0px 10px"}}
            alt={"magnifying-glass"}
            src={magnifyingGlassImg} />        
          <input
            onChange={this.search.bind(this)}
            style={_.extend(InputStyles.default, { width: "300px", padding: "15px 10px 15px 45px" })} />
        </div>

        <FriendList
          isAdding={true}
          tappedFriend={this.props.addFriend}
          onlineClientIds={this.props.onlineClientIds}
          search={this.state.search} />

        {this.state.startsWith && searchingUI}
      </ModalContainer>
    );
  }
}

export default FriendSearch;
