import { connect } from 'react-redux'
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';

import Button from '../Common/button';
import { color, media } from '../../Library/Styles/index';
import InputStyles from '../Common/inputStyles';
import LocalStorage from '../../Models/LocalStorage'
import { shouldRedirect } from '../../Library/helpers';
import Header from '../Common/header';

import { loginUserAction } from '../../Actions/index';

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
    document.body.style.overflow = 'visible';
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
    const result = await this.props.dispatch(loginUserAction(data));

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
        <MobileExit
          onClick={() => this.props.exitLogin()}
          src={require('../../Library/Images/exit-gray.png')}
          display={'fixed'} />
        <Header.small>
          login
        </Header.small>

        <div style={{marginTop:'25px',marginBottom:'25px'}}>
          <input
            style={_.extend({}, InputStyles.default, {width:'100%'})}
            placeholder={'username or email'} 
            autoCapitalize={'none'}
            onChange={(e) => this.setState({ email: e.target.value.replace(/ /g,'') })}
            ref={(input) => { this.emailInput = input; }}
            onClick={() => this.setState({ focusedOn: 'email' })} />

          <input
            style={_.extend({}, InputStyles.default, {width:'100%',marginTop:'10px'})}
            type={'password'}
            placeholder={'password'}
            autoCapitalize={'none'}
            onChange={(e) => this.setState({ password: e.target.value.replace(/ /g,'') })}
            ref={(input) => { this.passwordInput = input; }}
            onClick={() => this.setState({ focusedOn: 'password' })} />
        </div>

        <Button.medium onClick={this.handleLogin.bind(this)}>
          login
        </Button.medium>

        <p 
          onClick={() => this.setState({ redirect: '/start-free-trial' })} 
          style={{color:color.blue,fontSize:'1.2em',cursor:'pointer'}}>
          No account? Start Free Trial Now!
        </p>
      
        <p style={{marginTop:'0',color:(this.state.isError ? color.red : color.green)}}>
          {this.state.message}
        </p>
      </Container>
    );
  }
}

const MobileExit = styled.img`
  height: 25px;
  width: auto;
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
`

const Container = styled.div`
  background-color: white;
  border-radius: 15px;
  left: 50%;
  margin-top: -225px;
  margin-left: -225px;
  width: 450px;
  position: fixed;
  text-align: center;
  top: 50%;
  z-index: 10;
  padding: 20px 75px;
  box-sizing: border-box;
  ${media.phone`
    width: 100%;
    left: 0;
    top: 0;
    margin: 0;
    height: 100%;
    border-radius: 0;
    min-width: 0;
    z-index: 9999999;
    box-sizing: border-box;
    padding: 10%;
  `};   
`

export default connect()(Login)
