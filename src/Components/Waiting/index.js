import queryString from 'query-string';
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';

import Button from '../Common/button';
import Firebase from '../../Networking/Firebase';

import { color } from '../../Library/Styles/index';

class Waiting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: 'Be patient while other players join...',
      redirect: false,
      game: {}
    }
  }

  componentDidMount() {
    const name = localStorage.getItem('username');

    Firebase.refs.games.child(this.props.settings.accessCode).on('value', (snapshot) => {
      
      const game = _.pick(snapshot.val(), 'wordList', 'time');
      if (_.isEmpty(this.state.game)) { this.setState({ game }) };
      
      const kicked = !_.includes(_.keys(snapshot.val().players), name);
      const gameStarted = snapshot.val().status === 1;

      if (kicked) {
        this.setState({ text: 'You were kicked by the admin.' });
      } else if (gameStarted) {
        this.setState({ redirect: true });
      }
    });
  }

  componentWillUnmount() {
    Firebase.refs.games.child(this.props.settings.accessCode).off();
  }

  render() {
    if (this.state.redirect && !window.location.href.endsWith(this.state.redirect)) {
      const multiplayerGame = _.extend(this.state.game, { players: 'multi', accessCode: this.props.settings.accessCode });
      const redirect = this.state.text.includes('kicked')
        ? '/play'
        : `/play/${queryString.stringify(multiplayerGame)}`;
      return <Redirect push to={redirect} />;
    }

    const joinButton = () => {
      return <JoinButton onClick={() => this.setState({ redirect: true })}>
        Join Again
      </JoinButton>
    }

    return (
      <Layout>
        <Text>{this.state.text}</Text>
        {this.state.text.includes('kicked') && joinButton()}
      </Layout>
    );
  }
}

const Layout = styled.div`
  padding-top: 5%;
  margin: auto;
  text-align: center;
  width: 65%;
`

const Text = styled.p`
  font-size: 3em;
`

const JoinButton = Button.medium.extend`
  background-color: ${color.blue};
  &:hover {
    background-color: ${color.blue10l};
  }
`

export default Waiting;
