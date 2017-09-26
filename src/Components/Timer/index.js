import React, { Component } from 'react';
import styled from 'styled-components';
import { color } from '../../Library/Styles/index';

class Timer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeLeft: ''
    }
  }

  componentDidMount() {
    const timeLeft = this.props.time === '5' ? '5:00' : '3:00';
    this.setState({ timeLeft: timeLeft });
  }

  accountForLateness(secondsLate) {
    const totalSeconds = (this.props.time === '5' ? 300 : 180) - secondsLate;
    const minutes = parseInt(totalSeconds / 60);
    const seconds = (totalSeconds % 60).toString();
    return `${minutes}:${seconds.length === 1 ? '0' + seconds : seconds}`;
  }

  decrementSeconds(seconds) {
    const updated = parseInt(seconds, 10) - 1;
    return updated < 10 ? `0${updated}` : updated.toString()
  } 

  track(secondsLate) {
    const timeLeft = secondsLate ? this.accountForLateness(secondsLate) : this.state.timeLeft;
    const minutes = timeLeft.split(':')[0];
    const seconds = timeLeft.split(':')[1];

    if ((seconds === '00') && (minutes === '0')) {
      this.props.gameOver();
    } else {
      const time = seconds === '00'
        ? `${parseInt(minutes, 10) - 1}:59`
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
      <Text>{this.state.timeLeft}</Text>
    );
  }
}

const Text = styled.p`
  display: inline-block;
  line-height: 0px;
  font-size: 4em;
  color: ${color.red};
`

export default Timer;
