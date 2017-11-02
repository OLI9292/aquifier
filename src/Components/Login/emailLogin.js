import firebase from 'firebase';
import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';

import Button from '../Common/button';
import { color } from '../../Library/Styles/index';
import TextArea from '../Common/textarea';
import { validateEmail, sleep } from '../../Library/helpers';
import User from '../../Models/User';

class EmailLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isError: false,
      message: '',
      firstName: '',
      lastName: '',
      createAccountEmail: '',
      createAccountPw: '',
      loginEmail: '',
      loginPw: ''
    }
  }

  validateCreateAccount() {
    if (!this.state.firstName.length) {
      this.setState({ message: 'First name is missing' });
    } else if (!this.state.lastName.length) {
      this.setState({ message: 'Last name is missing' });
    } else if (!validateEmail(this.state.createAccountEmail)) {
      this.setState({ message: 'Please enter a valid email' });
    } else if ((this.state.createAccountPw.length < 6) || (this.state.createAccountPw.length > 26)) {
      this.setState({ message: 'Passwords must be between 6 and 26 characters' });
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

  handleCreateAccount = async () => {
    const validInput = this.validateCreateAccount();

    if (validInput) {
      const data = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.createAccountEmail.toLowerCase(),
        password: this.state.createAccountPw,
        signUpMethod: 'email'
      }

      const result = await User.createAccount(data);

      if (_.has(result, 'error')) {
        this.setState({ isError: true, message: result.error });
      } else {
        const userId = result.data._id;
        localStorage.setItem('userId', userId);
        localStorage.setItem('username', `${result.data.firstName} ${result.data.lastName}`);
        this.setState({ isError: false, message: 'Account created' });
        await sleep(500);
        this.props.exit();
      }
    } else {
      this.setState({ isError: true });
    }
  }

  handleLogin = async () => {
    const validInput = this.validateLoginInput();

    if (validInput) {
      const data = {
        email: this.state.loginEmail,
        password: this.state.loginPw
      }

      const result = await User.login(data);

      if (result.data && result.data.user) {
        const userId = result.data.user._id;
        localStorage.setItem('userId', userId);
        localStorage.setItem('username', `${result.data.user.firstName} ${result.data.user.lastName}`);
        const klass = _.first(result.data.user.classes.filter((c) => c.role === 'teacher'))
        if (!_.isUndefined(klass)) {
          localStorage.setItem('classId', klass.id);
        }
        this.setState({ isError: false, message: 'Logged in' });
        await sleep(500);
        this.props.exit();
      } else {
        const message = _.has(result, 'error') ? result.error : 'Server Error'
        this.setState({ isError: true, message: message });
      }
    } else {
      this.setState({ isError: true });
    }
  }

  render() {
    return (
      <Layout>
        <CreateAccount>
          <Header>Create Account</Header>
          <TextArea style={{marginTop: '5px;'}} placeholder={'first name'} onChange={(e) => this.setState({ 'firstName': e.target.value.replace(/ /g,'') })}></TextArea>
          <TextArea style={{marginTop: '5px;'}} placeholder={'last name'} onChange={(e) => this.setState({ 'lastName': e.target.value.replace(/ /g,'') })}></TextArea>
          <TextArea style={{marginTop: '5px;'}} placeholder={'email'} onChange={(e) => this.setState({ 'createAccountEmail': e.target.value.replace(/ /g,'') })}></TextArea>
          <TextArea style={{marginTop: '5px;'}} placeholder={'password'} onChange={(e) => this.setState({ 'createAccountPw': e.target.value.replace(/ /g,'') })}></TextArea>
          <LoginButton onClick={() => this.handleCreateAccount()}>create account</LoginButton>
        </CreateAccount>
        <LoginWithEmail>
          <Header>Login</Header>
          <TextArea style={{marginTop: '5px;'}} placeholder={'email'} onChange={(e) => this.setState({ 'loginEmail': e.target.value.replace(/ /g,'') })}></TextArea>
          <TextArea style={{marginTop: '5px;'}} placeholder={'password'} onChange={(e) => this.setState({ 'loginPw': e.target.value.replace(/ /g,'') })}></TextArea>
          <LoginButton onClick={() => this.handleLogin()}>login</LoginButton>
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

const LoginButton = Button.medium.extend`
  width: 250px;
  font-size: 1.2em;
  height: 50px;
  margin-top: 10px;
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
