import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';

import Dropdown from '../../Common/dropdown';
import User from '../../../Models/User';

const TIME_CHOICES = ['Weekly', 'Season', 'All Time'];
const LOCATION_CHOICES = ['School', 'Earth'];

class Leaderboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTime: TIME_CHOICES[0],
      selectedLocation: LOCATION_CHOICES[0]
    }
  }

  componentDidMount() {
    if (!User.loggedIn()) { return; }
    const user = JSON.parse(localStorage.getItem('user'));

  }

  render() {
    return (
      <div>
        <h1>Leaderboards</h1>
        <div>
          <Dropdown 
            choices={TIME_CHOICES} 
            handleSelect={(time) => this.setState({ selectedTime: time })}
            selected={this.state.selectedTime} />
          <Dropdown 
            choices={LOCATION_CHOICES} 
            handleSelect={(location) => this.setState({ selectedLocation: location })}
            selected={this.state.selectedLocation} />
        </div>
      </div>
    );
  }
}



export default Leaderboard;
