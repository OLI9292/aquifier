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
        <InnerContainer>
        <Text color={color.red}>
            {this.state.timeLeft}
        </Text>
        <Text color={color.blue}>
            {this.props.score}
        </Text>
        </InnerContainer>
      </Container>
    );
  }
}

const Container = styled.div`
  font-size: 3em;
  height: 100%;
  margin: auto;
`

const InnerContainer = styled.div`
  position: absolute;
  left: 50%;
  margin-left: -150px;
  top: 30px;
  height: 60px;
  display: flex;
  justify-content: space-between;  
  width: 300px;
  ${media.phone`
    width: 150px;
    margin-left: -75px;
  `};      
`

const Text = styled.p`
  color: ${props => props.color};
  height: 100%;
  margin: 0;
`

export default SpeedRound;
