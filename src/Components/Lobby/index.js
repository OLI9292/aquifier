import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';

import Button from '../Common/button';
import { color } from '../../Library/Styles/index';

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
        <Button.extraLarge color={color.blue} onClick={() => this.handleClick('/join')}>Join a Game!</Button.extraLarge>
        <Text>Enter an access code to join a<br />multiplayer game.</Text>
        <br /><br />
        <Button.extraLarge color={color.blue} onClick={() => this.handleClick('/settings/multiplayer')}>Create a Game!</Button.extraLarge>
        <Text>Create a vocabulary game<br />for multiple players.</Text>
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

const Text = styled.p`
  font-size: 2em;
`

export default Lobby;
