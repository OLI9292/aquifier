import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';

import Button from '../Common/button';
import { color } from '../../Library/Styles/index';
import Textarea from '../Common/textarea';
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

  trim(e) {
    return e.target.value.replace(/ /g,'')
  }

  handleNoAccount() {
    this.setState({ redirect: '/startfreetrial' })
  }

  redirect(location) {
    this.setState({ redirect: location });
  }

  render() {
    if (this.state.redirect && !window.location.href.endsWith(this.state.redirect)) {
      return <Redirect push to={this.state.redirect} />;
    }
    return (
      <Layout>
        <LoginWithEmail>
          <Header>Login</Header>
          <Textarea.medium style={{marginTop:'5px', width: '90%'}} placeholder={'username or email'} onChange={(e) => this.setState({ 'loginEmail': this.trim(e) })}></Textarea.medium>
          <Textarea.medium style={{marginTop:'5px', width: '90%'}} placeholder={'password'} onChange={(e) => this.setState({ 'loginPw': this.trim(e) })}></Textarea.medium>
          <LoginButton onClick={() => this.handleLogin()}>login</LoginButton>
          <NoAccount onClick={() => this.handleNoAccount()}>No account? Start Free Trial Now!</NoAccount>
        </LoginWithEmail>
        <Message isError={this.state.isError}>{this.state.message}</Message>
      </Layout>
    );
  }
}

const Layout = styled.div`
  position: fixed;
  z-index: 10;
  min-width: 600px;
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

const LoginWithEmail = styled.div`
  width: 90%;
  height: 90%;
  display: inline-block;
  vertical-align: top;
`

const LoginButton = Button.medium.extend`
  width: 90%;
  font-size: 1.2em;
  height: 50px;
  margin-top: 10px;
`

const NoAccount = styled.p`
  color: ${color.blue};
  font-size: 1.2em;
  cursor: pointer;
`

const Message = styled.p`
  margin-top: 0px;
  color: ${props => props.isError ? color.red : color.green};
`

export default EmailLogin;
