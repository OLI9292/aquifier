import _ from 'underscore';
import { connect } from 'react-redux'
import React, { Component } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router';

import Nav from './nav';
import MobileNav from './mobileNav';
import Login from './login';
import { shouldRedirect } from '../../Library/helpers';
import LocalStorage from '../../Models/LocalStorage'
import { logoutUserAction } from '../../Actions/index';

import { media, color, PHONE_MAX_WIDTH } from '../../Library/Styles/index';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  displayLogin() {
    console.log('displayLogin')
    this.setState({ displayLoginModal: true });
  }

  exitLogin() {
    this.setState({ displayLoginModal: false });
  }  

  logout() {
    this.setState({ redirect: '/' }, () => { 
      LocalStorage.logout(); 
      this.props.dispatch(logoutUserAction());
    })    
  }

  redirect(path) {
    this.setState({ redirect: path });
  }  

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }

    const { 
      loggedIn,
      path,
      isTeacher
    } = this.props;

    const loginModal = (() => {
      return this.state.displayLoginModal && <div>
        <Login
          exitLogin={this.exitLogin.bind(this)} />
        <DarkBackground
          onClick={() => this.exitLogin()} />
      </div>
    })()    

    return (
      <div>
        {loginModal}
        <NonMobileContainer show={!loggedIn}>
          <Nav
            isTeacher={isTeacher}
            loggedIn={loggedIn}
            path={path}
            displayLogin={this.displayLogin.bind(this)}
            exitLogin={this.exitLogin.bind(this)}
            logout={this.logout.bind(this)}
            redirect={this.redirect.bind(this)} />
        </NonMobileContainer>        
        <MobileContainer show={loggedIn}>
          <MobileNav
            isTeacher={isTeacher}
            loggedIn={loggedIn}
            path={path}
            displayLogin={this.displayLogin.bind(this)}
            exitLogin={this.exitLogin.bind(this)}
            logout={this.logout.bind(this)}
            redirect={this.redirect.bind(this)} />
        </MobileContainer>
      </div>      
    );
  }
}

const NonMobileContainer = styled.div`
  ${media.phone`
    display: ${props => props.show ? '' : 'none'};
  `}
`

const MobileContainer = styled.div`
  display: none;
  ${media.phone`
    display: ${props => props.show ? 'inline-block' : 'none'};
  `}
`

const DarkBackground = styled.div`
  background-color: rgb(0, 0, 0);
  background-repeat: repeat;
  filter: alpha(opacity=70);
  height: 100%;
  left: 0px;
  -moz-opacity: 0.7;
  opacity: 0.7;
  position: fixed;
  top: 0px;
  width: 100%;
  z-index: 5;
`

const mapStateToProps = (state, ownProps) => {
  const user = _.first(_.values(state.entities.user));
  const loggedIn = user !== undefined;
  const isTeacher = loggedIn && user.isTeacher;

  return {
    user: user,
    loggedIn: loggedIn,
    isTeacher: isTeacher
  };
};

export default connect(mapStateToProps)(Header);
