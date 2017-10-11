import firebase from 'firebase';
import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';

import Buttons from '../Buttons/default';
import { color } from '../../Library/Styles/index';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  handleFacebookLogin = async () => {
    var provider = new firebase.auth.FacebookAuthProvider();
    const user = await firebase.auth().signInWithPopup(provider);
  }

  handleGoogleLogin = async () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    const user = await firebase.auth().signInWithPopup(provider);
  }

  render() {
    return (
      <Layout>
        <Header>Create an Account or Login</Header>
        <Button color={color.facebookBlue} onClick={() => this.handleFacebookLogin()}>Continue with Facebook</Button>
        <Button color={color.googleRed} onClick={() => this.handleGoogleLogin()}>Continue with Google</Button>
        <Button color={color.gray} onClick={() => this.props.displayEmailLogin()}>Continue with Email</Button>
        <ContinueButton onClick={() => this.props.exitLogin()}>Continue without saving progress</ContinueButton>
      </Layout>
    );
  }
}

const Header = styled.h1`
  font-size: 1.75em;
  margin-bottom: 25px;
`

const Layout = styled.div`
  position: fixed;
  z-index: 10;
  width: 450px;
  height: 350px;
  text-align: center;
  background-color: white;
  top: 50%;
  left: 50%;
  margin-top: -175px;
  margin-left: -225px;
  border-radius: 15px;
`

const Button = Buttons.medium.extend`
  width: 275px;
  font-size: 1.3em;
  height: 50px;
  margin-top: 10px;
  background-color: ${props => props.color};
`

const ContinueButton = styled.p`
  font-size: 1.25em;
  margin-top: 20px;
  cursor: pointer;
`

export default Login;
