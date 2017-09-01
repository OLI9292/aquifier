import Firebase from '../../Networking/Firebase';
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';

class Waiting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false
    }
  }

  componentDidMount() {
    const gameStatusRef = Firebase.refs.games.child(this.props.accessCode).child('status');
    
    gameStatusRef.on('value', (snapshot) => {
      const gameStarted = snapshot.val() === 1;

      if (gameStarted) {
        gameStatusRef.off();
        this.setState({ redirect: true });
      }
    });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={`/game/${this.props.accessCode}/play`} />;
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
