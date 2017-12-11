import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';

import Button from '../Common/button';
import { color } from '../../Library/Styles/index';
import InputStyles from '../Common/inputStyles';
import { validateEmail, sleep } from '../../Library/helpers';
import User from '../../Models/User';

class EmailLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      createEmail: '',
      createPw: '',
      firstName: '',
      isError: false,
      lastName: '',
      loginEmail: '',
      loginPw: '',
      message: ''
    }
  }

  componentDidMount() {
    document.body.addEventListener('keydown', this.handleKeydown.bind(this), true);
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.handleKeydown.bind(this), true);
  }    

  handleKeydown(event) {
    if (event.key !== 'Enter') { return; }

    if (this.state.focusedOn === 'email') {
      this.passwordInput.focus();
      this.setState({ focusedOn: 'password' });
    } else if (this.state.focusedOn === 'password') {
      this.handleLogin();
    }
  }

  validateCreateAccount() {
    let message

    if      (!this.state.firstName.length)                           { message = 'First name is missing'; }
    else if (!this.state.lastName.length)                            { message = 'Last name is missing'; }
    else if (!validateEmail(this.state.createEmail))                 { message = 'Please enter a valid email'; }
    else if (!_.contains(_.range(6,27), this.state.createPw.length)) { message = 'Passwords must be between 6 and 26 characters'; }

    if (message) {
      this.setState({ message });
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
        email: this.state.createEmail.toLowerCase(),
        password: this.state.createPw,
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
        localStorage.setItem('user', JSON.stringify(result.data.user));
        const klass = _.first(result.data.user.classes.filter((c) => c.role === 'teacher'))
        if (klass) { localStorage.setItem('classId', klass.id); }
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
    if (this.state.redirect && !window.location.href.endsWith(this.state.redirect)) {
      return <Redirect push to={this.state.redirect} />;
    }

    return (
      <Layout>
        <div style={{width:'90%',margin:'0 auto'}}>
          <h1 style={{fontSize:'1.75em',marginBottom:'20px'}}>Login</h1>

          <input
            style={_.extend(InputStyles.default, {width:'100%',marginBottom:'10px'})}
            placeholder={'username or email'} 
            onChange={(e) => this.setState({ 'loginEmail': e.target.value.replace(/ /g,'') })}
            onClick={() => this.setState({ focusedOn: 'email'})} />

          <input
            style={_.extend(InputStyles.default, {width:'100%'})}
            placeholder={'password'}
            onChange={(e) => this.setState({ 'loginPw': e.target.value.replace(/ /g,'') })}
            ref={(input) => { this.passwordInput = input; }}
            onClick={() => this.setState({ focusedOn: 'password'})} />

          <LoginButton onClick={this.handleLogin}>login</LoginButton>

          <p 
            onClick={() => this.setState({ redirect: '/startfreetrial' })} 
            style={{color:color.blue,fontSize:'1.2em',cursor:'pointer'}}>
            No account? Start Free Trial Now!
          </p>
        </div>
        <p style={{marginTop:'0',color:(this.state.isError ? color.red : color.green)}}>
          {this.state.message}
        </p>
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

const LoginButton = Button.medium.extend`
  font-size: 1.25em;
  height: 50px;
  width: 100%;
`

export default EmailLogin;
