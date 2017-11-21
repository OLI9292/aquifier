import React, { Component } from 'react';
import styled from 'styled-components';
import { color } from '../../Library/Styles/index';

class Timer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      time: '',
      timeout: null,
      timeCheck: null
    }
  }

  componentDidMount() {
    const time = this.props.time === '5' ? '5:00' : '3:00';
    this.setState({ time });
  }

  accountForLateness(secondsLate) {
    const totalSeconds = (this.props.time === '5' ? 300 : 180) - secondsLate;
    // TODO: refactor
    if (totalSeconds < 0) {
      this.props.gameOver();
    }
    const minutes = parseInt(totalSeconds / 60, 10);
    const seconds = (totalSeconds % 60).toString();
    return `${minutes}:${seconds.length === 1 ? '0' + seconds : seconds}`;
  }

  componentWillUnmount() {
    clearInterval(this.state.timeCheck)
  }

  start(startTime) {
    const timeCheck = setInterval(() => { this.track(startTime) }, 100);
    this.setState({ timeCheck });  
  }

  track(startTime)  {
    const secondsLate = Math.floor(((new Date()).getTime() - startTime) / 1000);
    const time = this.accountForLateness(secondsLate);
    
    const [minutes, seconds] = [time.split(':')[0], time.split(':')[1]];
    const gameOver = seconds === '00' && minutes === '0';

    if (gameOver) {
      this.props.gameOver();
    } else {
      this.setState({ time });
    }
  }

  render() {
    return (
      <Text>{this.state.time}</Text>
    );
  }
}

const Text = styled.p`
  display: inline-block;
  line-height: 0px;
  font-size: 3em;
  color: ${color.red};
`

export default Timer;
