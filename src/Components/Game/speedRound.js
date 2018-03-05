import React, { Component } from 'react';
import styled from 'styled-components';
import moment from 'moment';

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
    const end = this.props.end ? moment.unix(this.props.end) : moment().add(time, 'minutes');

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
        <Text color={color.red}>
            {this.state.timeLeft}
        </Text>
        <Text color={color.blue}>
            {this.props.score}
        </Text>
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

const Text = styled.p`
  color: ${props => props.color};
  height: 100%;
`

export default SpeedRound;
