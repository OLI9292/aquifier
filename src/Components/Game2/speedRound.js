import React, { Component } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import clock from '../../Library/Images/clock.png';
import checkmark from '../../Library/Images/checkmark.png';

import { color, media } from '../../Library/Styles/index';

class SpeedRound extends Component {
  constructor(props) {
    super(props);

    this.state = {
      time: {
        minutes: 0,
        seconds: 0
      }
    }
  }
  
  componentDidMount() {
    this.setState({ 
      startTime: Date.now(),
      timeLimit: this.props.time * 60 // min to sec
    }, () => setInterval(() => this.track(), 100))
  }

  track()  {
    const secondsPassed = Math.floor(moment.duration(moment().diff(this.state.startTime)).asSeconds());
    if (secondsPassed >= this.state.timeLimit) {
      this.props.gameOver();
    } else {
      const secondsLeft = this.state.timeLimit - secondsPassed;
      const minutes = Math.floor(secondsLeft/60);
      const seconds = secondsLeft % 60;
      this.setState({ time: { minutes: minutes, seconds: seconds }});
    }
  }

  render() {
    const { 
      time
    } = this.state;

    const timer = (() => {
      const seconds = time.seconds < 10 ? `0${time.seconds}` : String(time.seconds);
      return String(time.minutes) + ':' + seconds;
    })();

    return (
      <Container>
        <Timer>
          <Icon src={clock} />
          <p>
            {timer}
          </p>
        </Timer>
        <Score>
          <Icon src={checkmark} />
          <p>
            {this.props.score}
          </p>
        </Score>
      </Container>
    );
  }
}

const Container = styled.div`
  font-size: 3em;
  color: ${color.red};
  display: flex;
  align-items: center;
  height: 100%;
  width: 300px;
  margin: auto;
  justify-content: space-between;
  ${media.phone`
    width: 200px;
  `}     
`

const Timer = styled.div`
  color: ${color.red};
  height: 100%;
  display: flex;
  align-items: center;  
`

const Score = styled.div`
  color: ${color.blue};
  height: 100%;
  display: flex;
  align-items: center;  
`

const Icon = styled.img`
  height: 50px;
  width: 50px;
`

export default SpeedRound;
