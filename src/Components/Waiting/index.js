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
      return <Redirect push to={`/game/${this.props.accessCode}/start`} />;
    }

    return (
      <Layout>
        <Text>Waiting for the admin to start the game ...</Text>
      </Layout>
    );
  }
}

const Layout = styled.div`
  margin: auto;
  padding: 50px 0px 50px 0px;
  width: 80%;
  height: 80%;
  text-align: center;
`

const Text = styled.p`
  font-size: 3em;
`

export default Waiting;
