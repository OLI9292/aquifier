import _ from 'underscore';
import React, { Component } from 'react';

import InputStyles from '../../Common/inputStyles';

import {
  ModalContainer
} from './components';

class FriendSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  search(e) {
    if (e.target.value === "akiva-sauce") {
      this.setState({ show: true });
    }
  }

  addFriend(name) {
    const friend = { id: "5afb02ad45b1880020d62482", username: "akiva-sauce" };
    this.props.addFriend(friend);
  }

  render() {
    const user = name => <div 
      onClick={() => this.addFriend(name)}
      style={{cursor:"pointer"}}>
      {name}
    </div>;

    const searchResults = <div>{_.map(["akiva-sauce"], user)}</div>;

    return (
      <ModalContainer>
        <input
          onChange={this.search.bind(this)}
          style={InputStyles.default} />
        {this.state.show && searchResults}
      </ModalContainer>
    );
  }
}

export default FriendSearch;
