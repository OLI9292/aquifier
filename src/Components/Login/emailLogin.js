import firebase from 'firebase';
import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';

import Buttons from '../Buttons/default';
import { color } from '../../Library/Styles/index';
import TextAreas from '../TextAreas/index';
import { validateEmail } from '../../Library/helpers';

class EmailLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isError: false,
      message: '',
      createAccountEmail: '',
      createAccountPw: '',
      createAccountConfirmPw: '',
      createAccountClassId: '',
      loginEmail: '',
      loginPw: ''
    }
  }

  validateCreateAccount() {
    if (!validateEmail(this.state.createAccountEmail)) {
      this.setState({ message: 'Please enter a valid email' });
    } else if ((this.state.createAccountPw.length < 6) || (this.state.createAccountPw.length > 12)) {
      this.setState({ message: 'Passwords must be between 6 and 12 characters' });
    } else if (this.state.createAccountPw !== this.state.createAccountConfirmPw) {
      this.setState({ message: 'Passwords do not match' });
    } else if ((this.state.createAccountClassId.length < 4) || (this.state.createAccountClassId.length > 10)) {
      this.setState({ message: 'Class IDs must be between 4 and 10 characters' });
    } else {
      return true;
    }
  }

  validateLoginInput() {
    if (!this.state.loginEmail.length) {
      this.setState({ message: 'Email missing' });
    } else if (!this.state.loginPw.length) {
      this.setState({ message: 'Password missing' });
    } else {
      return true;
    }
  }

  handleCreateAccount() {
    const valid = this.validateCreateAccount();

    if (valid) {
      // TODO: - make auth call to server to create account
      // this.setState({ message: 'Account created.', isError: false });
    } else {
      this.setState({ isError: true });
    }
  }

  handleLogin() {
    const validInput = this.validateLoginInput();

    if (validInput) {
      // TODO: - make auth call to server to login
    } else {
      this.setState({ isError: true });
    }
  }

  render() {
    return (
      <Layout>
        <CreateAccount>
          <Header>Create Account</Header>
          <TextArea placeholder={'email'} onChange={(e) => this.setState({ 'createAccountEmail': e.target.value.replace(/ /g,'') })}></TextArea>
          <TextArea placeholder={'password'} onChange={(e) => this.setState({ 'createAccountPw': e.target.value.replace(/ /g,'') })}></TextArea>
          <TextArea placeholder={'confirm password'} onChange={(e) => this.setState({ 'createAccountConfirmPw': e.target.value.replace(/ /g,'') })}></TextArea>
          <TextArea placeholder={'class ID (optional)'} onChange={(e) => this.setState({ 'createAccountClassId': e.target.value.replace(/ /g,'') })}></TextArea>
          <Button onClick={() => this.handleCreateAccount()}>create account</Button>
        </CreateAccount>
        <LoginWithEmail>
          <Header>Login</Header>
          <TextArea placeholder={'email'} onChange={(e) => this.setState({ 'loginEmail': e.target.value.replace(/ /g,'') })}></TextArea>
          <TextArea placeholder={'password'} onChange={(e) => this.setState({ 'loginPw': e.target.value.replace(/ /g,'') })}></TextArea>
          <Button onClick={() => this.handleLogin()}>login</Button>
          <ForgotPassword>forgot password</ForgotPassword>
        </LoginWithEmail>
        <Message isError={this.state.isError}>{this.state.message}</Message>
      </Layout>
    );
  }
}

const Layout = styled.div`
  position: fixed;
  z-index: 10;
  width: 600px;
  height: 450px;
  text-align: center;
  background-color: white;
  top: 50%;
  left: 50%;
  margin-top: -225px;
  margin-left: -300px;
  border-radius: 15px;
`

const Header = styled.h1`
  font-size: 1.75em;
  margin-bottom: 20px;
`

const CreateAccount = styled.div`
  width: 50%;
  height: 90%;
  display: inline-block;
`

const LoginWithEmail = styled.div`
  width: 50%;
  height: 90%;
  display: inline-block;
  vertical-align: top;
`

const TextArea = TextAreas.medium.extend`
  font-size: 1.2em;
  margin-top: 5px;
`

const Button = Buttons.medium.extend`
  width: 250px;
  font-size: 1.2em;
  height: 50px;
  margin-top: 10px;
  background-color: ${color.blue};
`

const ForgotPassword = styled.p`
  color: ${color.blue};
  font-size: 1.2em;
  cursor: pointer;
`

const Message = styled.p`
  margin-top: 0px;
  color: ${props => props.isError ? color.red : color.green};
`

export default EmailLogin;
