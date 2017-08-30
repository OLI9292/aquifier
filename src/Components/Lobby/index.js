import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';

import Buttons from '../Buttons/default';
import { color } from '../../Assets/Styles/index';

class Lobby extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null
    };
  }

  handleClick(location) {
    this.setState({ redirect: location });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect} />;
    }

    return (
      <Layout>
        <Button onClick={() => this.handleClick('/join')}>Join a Game!</Button>
        <Text>Enter an access code to join a<br />multiplayer game.</Text>
        <br /><br />
        <Button onClick={() => this.handleClick('/settings-multi')}>Create a Game!</Button>
        <Text>Create a vocabulary game<br />for multiple players.</Text>
      </Layout>
    );
  }
}

const Layout = styled.div`
  margin: auto;
  padding: 50px 0px 50px 0px;
  text-align: center;
  width: 80%;
`

const Text = styled.p`
  font-size: 2em;
`

const Button = Buttons.extraLarge.extend`
  background-color: ${color.blue};
  &:hover {
    background-color: ${color.blue10l};
  }
`

export default Lobby;
