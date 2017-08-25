import React, { Component } from 'react';
import './index.css';
import logo from '../../assets/images/logo.png';
import ActionButton from '../ActionButton/index';

class Home extends Component {
  render() {
    return (
      <div className="home-container">
        <div className="header">
          <img src={logo} className="logo" />
          <h2>WORDCRAFT</h2>
          <p className="pitch">Understand, don't memorize, advanced<br />English  vocabulary.</p>
        </div>
        <div className="action-buttons">
          <ActionButton type="play" />
          <ActionButton type="download" />
        </div>
      </div>
    );
  }
}

export default Home;
