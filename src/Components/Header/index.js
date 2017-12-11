import React, { Component } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router';
import _ from 'underscore';

import { color } from '../../Library/Styles/index';
import { isHome } from '../../Library/helpers';
import EmailLogin from '../Login/emailLogin';
import Navigation from './navigation';
import User from '../../Models/User';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayLogin: false
    };
  }

  componentDidMount() {
    const userId = User.loggedIn('_id');
    const classId = localStorage.getItem('classId');

    this.setState({
      userId: userId,
      isTeacher: !_.isNull(classId),
      loggedIn: !_.isNull(userId)
    })
  }

  exitLogin() {
    const userId = User.loggedIn('_id');
    const classId = localStorage.getItem('classId');

    if (isHome()) {
      this.setState({ redirect: '/play' })
    } else {
      // better would be to reload the component
      window.location.reload()
      this.setState({
        displayEmailLogin: false,
        loggedIn: !_.isNull(userId),
        userId: userId,
        isTeacher: !_.isNull(classId),
      });
    }
  }

  displayEmailLogin() {
    this.setState({ displayEmailLogin: true });
  }

  handleLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('classId');
    this.setState({ redirect: '/', loggedIn: false });
  }

  handleBackgroundClick() {
    this.setState({ displayEmailLogin: false });
  }

  render() {
    if (this.state.redirect && !window.location.href.endsWith(this.state.redirect)) {
      return <Redirect push to={this.state.redirect} />;
    }

    const login = () => {
      if (this.state.displayEmailLogin){
        return <EmailLogin exit={this.exitLogin.bind(this)}/>
      }
    }

    const startFreeTrial = () => {
      if (!this.state.loggedIn && window.location.href.endsWith('/')) {
        return <NavLink color={color.green} colorHover={color.green10l} display onClick={() => window.scrollTo({ top: 2875, left: 0, behavior: 'smooth'})}>Start Free Trial</NavLink>
      } else if (!this.state.loggedIn) {
        return <NavLink color={color.green} colorHover={color.green10l} display onClick={() => this.setState({ redirect: '/startfreetrial' })}>Start Free Trial</NavLink>
      }
    }

    return (
      <Container>
        <Content>
          <Title onClick={() => this.setState({ redirect: '/' })}>WORDCRAFT</Title>
          {startFreeTrial()}
          {login()}
          <DarkBackground display={this.state.displayEmailLogin} onClick={() => this.handleBackgroundClick()} />
          <Navigation
            loggedIn={this.state.loggedIn}
            isTeacher={this.state.isTeacher}
            userId={this.state.userId}
            login={() => this.setState({ displayEmailLogin: true })}
            logout={this.handleLogout.bind(this)}
          />
        </Content>
      </Container>
    );
  }
}

const Container = styled.div`
  background-color: white;
  height: 90px;
  width: 100%;
`

const Content = styled.div`
  width: 95%;
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
`

const DarkBackground = styled.div`
  display: ${props => props.display ? '' : 'none'};
  z-index: 5;
  background-color: rgb(0, 0, 0);
  opacity: 0.7;
  -moz-opacity: 0.7;
  filter: alpha(opacity=70);
  height: 100%;
  width: 100%;
  background-repeat: repeat;
  position: fixed;
  top: 0px;
  left: 0px;
`

const Title = styled.h1`
  color: ${color.yellow};
  font-size: 2.5em;
  cursor: pointer;
  margin-top: 20px;
  @media (max-width: 600px) {
    font-size: 1.5em;
  }
`
const NavLink = styled.p`
  flex: auto;
  padding-top: 18px;
  line-height: 10px;
  color: ${props => props.color};
  display: ${props => props.display ? 'inline-block' : 'none'};
  font-size: 1.5em;
  margin-right: 40px;
  text-align: right;
  &:hover {
    color: ${props => props.colorHover};
  }
  @media (max-width: 450px) {
    font-size: 0.9em;
  }
`

export default Header;
