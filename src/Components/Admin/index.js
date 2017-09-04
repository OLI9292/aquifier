import Firebase from '../../Networking/Firebase';
import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';

import Buttons from '../Buttons/default';
import Timer from '../Timer/index';
import { color } from '../../Library/Styles/index';

class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accessCode: null
    }

    this.startMatch = this.startMatch.bind(this);
  }

  async componentDidMount() {
    let words = await Firebase.fetchWords();
    words = _.shuffle(_.pluck(words.filter((w) => this.matchesCategory(w.categories, this.props.topics)), 'value')).join(',');

    Firebase.refs.games.once('value', (snapshot) => {
      const accessCodes = _.keys(snapshot.val());
      const accessCode = this.generateAccessCode(accessCodes);

      const game = {};

      game[accessCode] = { 
        level: this.props.level,
        time: this.props.time,
        status: 0,
        words: words
      };

      Firebase.refs.games.update(game, (e) => {
        if (e) {
          console.log(e);
        } else {
          this.setState({ accessCode: accessCode }, this.fetchWords);
        }
      });
    });
  }

  matchesCategory(a, b) {
    return _.intersection(a.map((x) => x.toLowerCase()), b.map((y) => y.toLowerCase())).length > 0
  }

  generateAccessCode(exclude) {
    return _.sample(_.range(1000, 10000).filter((n) => !_.contains(exclude, n)));
  }

  startMatch() {
    const time = (new Date()).getTime();
    const startMatchUpdate = { status: 1, startTime: time };

    Firebase.refs.games.child(this.state.accessCode).update(startMatchUpdate, (e) => {
      if (e) {
        // TODO: - handle / show error
        console.log(e);
      } else {
        this.timer.track();
      }
    });
  }

  render() {
    const content = () => {
      return <Container>
        <AccessCode>{this.state.accessCode}</AccessCode>
        <Timer ref={instance => { this.timer = instance }} />
        <StartButton onClick={this.startMatch}>Start Match</StartButton>
      </Container>
    }

    return (
      <Layout>
        <Heading>Access Code</Heading>
        {this.state.accessCode && content()}
      </Layout>
    );
  }
}

const Layout = styled.div`
  margin: auto;
  padding-top: 5%;
  text-align: center;
  width: 80%;
`

const Heading = styled.div`
  font-size: 4em;
`

const AccessCode = styled.h1`
  color: ${color.red};
  font-size: 10em;
  line-height: 30%;
`

const Container = styled.div`
`

const StartButton = Buttons.large.extend`
  background-color: ${color.blue};
  &:hover {
    background-color: ${color.blue10l};
  }
  font-size: 2.5em;
`

export default Admin;
