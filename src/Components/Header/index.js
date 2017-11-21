import React, { Component } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router';
import _ from 'underscore';

import { color } from '../../Library/Styles/index';
import { isHome } from '../../Library/helpers';
import Login from '../Login/index';
import EmailLogin from '../Login/emailLogin';
import Navigation from './navigation';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayLogin: false
    };
  }

  componentDidMount() {
    const userId = localStorage.getItem('userId');
    const classId = localStorage.getItem('classId');
    
    this.setState({
      userId: userId,
      isTeacher: !_.isNull(classId),
      loggedIn: !_.isNull(userId)
    })
  }

  exitLogin() {
    const userId = localStorage.getItem('userId');
    const classId = localStorage.getItem('classId');

    if (isHome()) {
      this.setState({ redirect: '/play' })
    } else {
      this.setState({
        displayLogin: false,
        displayEmailLogin: false,
        loggedIn: !_.isNull(userId),
        userId: userId,
        isTeacher: !_.isNull(classId)
      });      
    }
  }

  displayEmailLogin() {
    this.setState({ displayEmailLogin: true });
  }

  handleLogout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    this.setState({ redirect: '/', loggedIn: false });
  }

  handleBackgroundClick() {
    this.setState({ displayLogin: false, displayEmailLogin: false });
  }  

  render() {
    if (this.state.redirect && !window.location.href.endsWith(this.state.redirect)) {
      return <Redirect push to={this.state.redirect} />;
    }

    const login = () => {
      if (this.state.displayEmailLogin) {
        return <EmailLogin exit={this.exitLogin.bind(this)}/>
      } else if (this.state.displayLogin) {
        return <Login displayEmailLogin={this.displayEmailLogin.bind(this)} exit={this.exitLogin.bind(this)} />
      }
    }    

    return (
      <Container>
        <Content>
          <Title onClick={() => this.setState({ redirect: '/' })}>WORDCRAFT</Title>
          {login()}
          <DarkBackground display={this.state.displayLogin} onClick={() => this.handleBackgroundClick()} />
          <Navigation
            loggedIn={this.state.loggedIn}
            isTeacher={this.state.isTeacher}
            userId={this.state.userId}
            login={() => this.setState({ displayLogin: true })}
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

export default Header;
