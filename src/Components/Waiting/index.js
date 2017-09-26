import queryString from 'query-string';
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';

import Firebase from '../../Networking/Firebase';

class Waiting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false
    }
  }

  componentDidMount() {
    Firebase.refs.games.child(this.props.settings.accessCode).child('status').on('value', (snapshot) => {
      const gameStarted = snapshot.val() === 1;
      
      if (gameStarted) {
        this.setState({ redirect: true });
      }
    });
  }

  componentWillUnmount() {
    Firebase.refs.games.child(this.props.settings.accessCode).child('status').off();
  }

  render() {
    if (this.state.redirect) {
      const settings = _.mapObject(this.props.settings, (v, k) => k === 'component' ? 'game' : v);
      return <Redirect push to={`/game/${queryString.stringify(settings)}`} />;
    }

    return (
      <Layout>
        <Text>Waiting for the admin to start the game ...</Text>
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

export default Waiting;
