import firebase from 'firebase';
import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';

import Button from '../Common/button';
import { color } from '../../Library/Styles/index';
import User from '../../Models/User';

class Login extends Component {
  
  handleFacebookLogin = async () => {
    var provider = new firebase.auth.FacebookAuthProvider();
    try {
      const firebaseResult = await firebase.auth().signInWithPopup(provider);
      
      if (_.has(firebaseResult, 'additionalUserInfo')) {
        const facebookId = firebaseResult.additionalUserInfo.profile.id;
        const query = { type: 'query', value: `?facebookId=${facebookId}` }
        const result = await User.fetch(query);
        
        if (_.has(result.data, 'user')) {
          const userId = result.data.user._id;
          localStorage.setItem('userId', userId);
          this.props.exit();
        } else {
          const profile = firebaseResult.additionalUserInfo.profile;
          const email = profile.email;
          const firstName = profile.first_name;
          const lastName = profile.last_name;

          const data = {
            firstName: firstName,
            lastName: lastName,
            facebookId: facebookId,
            email: email,
            signUpMethod: 'facebook'
          }

          const result = await User.createAccount(data);
          
          if (_.has(result.data, 'user')) {
            const userId = result.data.user._id;
            localStorage.setItem('userId', userId);
            this.props.exit();
          } else {
            this.setState({ isError: true, message: _.has(result.data, 'error') ? result.data.error : 'Server Error' });
          }
        }
      }
    } catch (e) {
      console.log(`Error handling facebook login -> ${e}`)
    }
  }

  handleGoogleLogin = async () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    try {
      const firebaseResult = await firebase.auth().signInWithPopup(provider);
      const email = firebaseResult.user.email;
      const query = { type: 'query', value: `?email=${email}` }
      const result = await User.fetch(query);

      if (_.has(result.data, 'user')) {
        const userId = result.data.user._id;
        localStorage.setItem('userId', userId);
        this.props.exit();
      } else {        
        const email = firebaseResult.additionalUserInfo.profile.email
        const firstName = firebaseResult.additionalUserInfo.profile.given_name;
        const lastName = firebaseResult.additionalUserInfo.profile.family_name;

        const data = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          signUpMethod: 'google'
        }

        const result = await User.createAccount(data);

        if (_.has(result.data, 'user')) {
          const userId = result.data.user._id;
          localStorage.setItem('userId', userId);
          this.props.exit();
        } else {
          this.setState({ isError: true, message: _.has(result.data, 'error') ? result.data.error : 'Server Error' });
        }
      }
    } catch (e) {
      console.log(`Error handling google login -> ${e}`)
    }
  }

  render() {
    return (
      <Layout>
        <Header>Create an Account or Login</Header>
        <LoginButton color={color.facebookBlue} onClick={() => this.handleFacebookLogin()}>Continue with Facebook</LoginButton>
        <LoginButton color={color.googleRed} onClick={() => this.handleGoogleLogin()}>Continue with Google</LoginButton>
        <LoginButton color={color.gray} onClick={() => this.props.displayEmailLogin()}>Continue with Email</LoginButton>
        <ContinueButton onClick={() => this.props.exit()}>Continue without saving progress</ContinueButton>
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

const LoginButton = Button.medium.extend`
  width: 275px !important;
  font-size: 1.3em;
  height: 50px;
  margin-top: 10px;
`

const ContinueButton = styled.p`
  font-size: 1.25em;
  margin-top: 20px;
  cursor: pointer;
`

export default Login;
