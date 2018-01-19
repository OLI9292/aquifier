import { connect } from 'react-redux'
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';

import Button from '../Common/button';
import { color } from '../../Library/Styles/index';
import InputStyles from '../Common/inputStyles';
import LocalStorage from '../../Models/LocalStorage'
import { shouldRedirect } from '../../Library/helpers';

import { loginUser } from '../../Actions/index';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      focusedOn: 'email'
    }

    this.handleKeydown = this.handleKeydown.bind(this);
  }

  componentDidMount() {
    document.body.addEventListener('keydown', this.handleKeydown);
    this.emailInput.focus();
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.handleKeydown);
  }    

  handleKeydown(event) {
    if (event.key !== 'Enter') { 
      return;
    }

    if (this.state.focusedOn === 'email') {
      this.passwordInput.focus();
      this.setState({ focusedOn: 'password' });
    } else if (this.state.focusedOn === 'password') {
      this.handleLogin();
    }
  }

  validLogin() {
    if      (!this.state.email.length)    { this.setState({ isError: true, message: 'Email missing.' }); }
    else if (!this.state.password.length) { this.setState({ isError: true, message: 'Password missing.' }); }
    else                                  { return true; }
  }

  handleLogin = async () => {
    if (!this.validLogin()) { 
      return;
    }

    const data = { email: this.state.email, password: this.state.password };
    const result = await this.props.dispatch(loginUser(data));

    if (result.error) {
      this.setState({ isError: true, message: result.error })
    } else if (result.response.entities) {
      LocalStorage.setSession(result.response.entities.session);
      this.setState({ isError: false, message: 'Logged in.' });
      this.props.exitLogin();
    }
  }

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }

    return (
      <Container>
        <div style={{width:'90%',margin:'0 auto'}}>
          <h1 style={{fontSize:'1.75em',marginBottom:'20px'}}>
            Login
          </h1>

          <input
            style={_.extend({}, InputStyles.default, {width:'100%',marginBottom:'10px'})}
            placeholder={'username or email'} 
            onChange={(e) => this.setState({ email: e.target.value.replace(/ /g,'') })}
            ref={(input) => { this.emailInput = input; }}
            onClick={() => this.setState({ focusedOn: 'email'})} />

          <input
            style={_.extend({}, InputStyles.default, {width:'100%'})}
            placeholder={'password'}
            onChange={(e) => this.setState({ password: e.target.value.replace(/ /g,'') })}
            ref={(input) => { this.passwordInput = input; }}
            onClick={() => this.setState({ focusedOn: 'password'})} />

          <LoginButton onClick={this.handleLogin.bind(this)}>
            login
          </LoginButton>

          <p 
            onClick={() => this.setState({ redirect: '/start-free-trial' })} 
            style={{color:color.blue,fontSize:'1.2em',cursor:'pointer'}}>
            No account? Start Free Trial Now!
          </p>
        </div>
        
        <p style={{marginTop:'0',color:(this.state.isError ? color.red : color.green)}}>
          {this.state.message}
        </p>
      </Container>
    );
  }
}

const Container = styled.div`
  background-color: white;
  border-radius: 15px;
  left: 50%;
  margin-top: -225px;
  margin-left: -300px;
  min-width: 600px;
  position: fixed;
  text-align: center;
  top: 50%;
  z-index: 10;
`

const LoginButton = Button.medium.extend`
  margin-top: 20px;
  width: 100%;
`

export default connect()(Login)
