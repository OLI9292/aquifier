import React, { Component } from 'react';
import './index.css';

class Timer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeLeft: '3:00'
    }
  }

  decrementSeconds(seconds) {
    const updated = parseInt(seconds) - 1;
    return updated < 10 ? `0${updated}` : updated.toString()
  } 

  track() {
    const minutes = this.state.timeLeft.split(':')[0];
    const seconds = this.state.timeLeft.split(':')[1];

    if ((seconds === '00') && (minutes === '0')) {
      // handle game over
    } else {
      const time = seconds === '00'
        ? `${parseInt(minutes) - 1}:59`
        : `${minutes}:${this.decrementSeconds(seconds)}`
      setTimeout(() => { this.update(time) }, 1000);
    }
  }

  update(time) {
    this.setState({ timeLeft: time });
    this.track();
  }

  render() {
    return (
      <div className="timer">
        <p>{this.state.timeLeft}</p>
      </div>
    );
  }
}

export default Timer;
