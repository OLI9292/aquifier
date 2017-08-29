import Firebase from '../../Networking/Firebase';
import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';

import DefaultButton from '../Buttons/default';
import Header from '../Header/index';
import Timer from '../Timer/index';
import { color } from '../../Assets/Styles/index';

class Spectator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accessCode: null
    }

    this.startMatch = this.startMatch.bind(this);
  }

  componentDidMount() {
    Firebase.matches.once('value', (snapshot) => {
      const accessCodes = _.keys(snapshot.val());
      const accessCode = this.generateAccessCode(accessCodes);

      const match = {};
      match[accessCode] = { status: 0 };

      Firebase.matches.update(match, (e) => {
        if (e) {
          console.log(e);
        } else {
          this.setState({ accessCode: accessCode });
        }
      });
    });
  }

  generateAccessCode(exclude) {
    return _.sample(_.range(1000, 10000).filter((n) => !_.contains(exclude, n)));
  }

  startMatch() {
    const time = (new Date()).getTime();
    const startMatchUpdate = { status: 1, startTime: time };

    Firebase.matches.child(this.state.accessCode).update(startMatchUpdate, (e) => {
      if (e) {
        console.log(e);
      } else {
        this.timer.track();
      }
    });
  }

  render() {
    return (
      <OuterFrame>
        <Header />
        <InnerFrame>
          <Content>
            <Heading>Access Code</Heading>
            <AccessCode>{this.state.accessCode}</AccessCode>
            <Timer ref={instance => { this.timer = instance }} />
            <StartButton onClick={this.startMatch}>Start Match</StartButton>
          </Content>
        </InnerFrame>
      </OuterFrame>
    );
  }
}

const OuterFrame = styled.div`
  background-color: ${color.lightestGray};
  width: 100%;
  height: 100%;
`

const InnerFrame = styled.div`
  width: 80%;
  max-width: 900px;
  margin: auto;
  margin-top: 25px;
  background-color: white;  
  border-radius: 10px;
`

const Content = styled.div`
  padding: 50px 0px 50px 0px;
  text-align: center;
`

const Heading = styled.div`
  font-size: 6em;
`

const AccessCode = styled.h1`
  font-size: 12em;
  height: 50px;
  line-height: 50px;
  color: ${color.red};
`

const StartButton = DefaultButton.extend`
  background-color: ${color.blue};
  &:hover {
    background-color: ${color.blue10l};
  }
  font-size: 2.5em;
  width: 40%;
`

export default Spectator;
