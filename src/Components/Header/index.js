import React, { Component } from 'react';
import styled from 'styled-components';
import logo from '../../Library/Images/logo.png';
import { Redirect } from 'react-router';
import _ from 'underscore';

import { color } from '../../Library/Styles/index';
import Login from '../Login/index';
import Link from '../Common/link';
import EmailLogin from '../Login/emailLogin';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayLogin: false,
      displayDropdown: false
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

    this.setState({
      displayLogin: false,
      displayEmailLogin: false,
      loggedIn: !_.isNull(userId),
      userId: userId,
      isTeacher: !_.isNull(classId)
    });
  }

  displayEmailLogin() {
    this.setState({ displayEmailLogin: true });
  }

  handleLogout() {
    localStorage.clear('userId');
    localStorage.clear('username');
    this.setState({ redirect: '/' });
  }

  handleBackgroundClick() {
    this.setState({ displayLogin: false, displayEmailLogin: false });
  }  

  displayDropdown() {
    this.setState({ displayDropdown: !this.state.displayDropdown })
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect} />;
    }

    const dropdown = () => {
      return <DropdownContainer visibility={this.state.displayDropdown ? 'visible' : 'hidden'}>
        <Link onClick={() => this.setState({ redirect: `/profile/${this.state.userId}`})} display={this.state.isTeacher ? 'none' : 'block'} color={color.green}>Progress</Link>
        <Link onClick={() => this.setState({ redirect: '/dashboard' })}  display={this.state.isTeacher ? 'block' : 'none'} color={color.purple}>Class</Link>
        <Link onClick={() => this.setState({ redirect: '/lessons'})} display={this.state.isTeacher ? 'block' : 'none'} color={color.green}>Lessons</Link>
        <Link color={color.red} onClick={() => this.handleLogout()}>Logout</Link>
      </DropdownContainer>
    }    

    const navigation = () => {
      if (this.state.loggedIn) {
        return <NavigationContainer onClick={() => this.displayDropdown()}>
          <div>
            <Link style={{display: 'inline-block', verticalAlign: 'top'}} color={color.blue}>Me</Link>
            <DropdownImage src={require('../../Library/Images/dropdown.png')} />
          </div>
          {dropdown()}
        </NavigationContainer>
      } else {
        return <NavigationContainer>
          <Link color={color.blue} onClick={() => this.setState({ displayLogin: true })}>Login</Link>
        </NavigationContainer>
      }
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
          {navigation()}
        </Content>
      </Container>
    );
  }
}

const DropdownContainer = styled.div`
  width: 100px;
  background-color: white;
  border-radius: 10px;
  padding: 5px;
  border: 5px solid ${color.lightGray};
  visibility: ${props => props.visibility};
`

const DropdownImage = styled.img`
  margin: 4px 0px 0px 5px;
  height: 25px;
  display: inline-block;
`

const Container = styled.div`
  background-color: white;
  height: 90px;
  width: 100%;
  min-width: 400px;
`

const NavigationContainer = styled.div`
  margin-top: 30px;
  cursor: pointer;
  width: 125px;
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
`

export default Header;
