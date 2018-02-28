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
    const time = this.props.time || 3;
    const end = moment.unix(this.props.end) || moment().add(time, 'minutes');
  
    this.setState(
      { end }, 
      () => this.interval = setInterval(() => this.track(), 100)
    )
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  track()  {
    const { minutes, seconds } = moment.duration(this.state.end.diff(moment()))._data;

    console.log(minutes, seconds)

    if (minutes <= 0 && seconds <= 0) {
      clearInterval(this.interval);
      this.props.gameOver();
    } else {
      const timeLeft = minutes + ':' + (seconds < 10 ? `0${seconds}` : seconds);
      this.setState({ timeLeft });
    }
  }

  render() {
    return (
      <Container>
        <Timer>
          <Icon src={clock} />
          <p>
            {this.state.timeLeft}
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
