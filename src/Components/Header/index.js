import _ from 'underscore';
import { connect } from 'react-redux'
import React, { Component } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router';

import Nav from './nav';
import MobileNav from './mobileNav';
import SignUp from '../SignUp/index';
import Login from './login';
import { shouldRedirect } from '../../Library/helpers';
import LocalStorage from '../../Models/LocalStorage'
import { logoutUserAction } from '../../Actions/index';
import { DarkBackground } from '../Common/darkBackground';
import { media } from '../../Library/Styles/index';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  displayLogin() {
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

    const loginModal = <div>
      <Login
        exitLogin={this.exitLogin.bind(this)} />
      <DarkBackground
        onClick={() => this.exitLogin()} />
    </div>;

    const showMobileNav = loggedIn && !_.contains(['/team','/research','/contact'], path);

    return (
      <div>
        {this.state.displaySignUp && <SignUp displaySignUp={bool => this.setState({ displaySignUp: bool })} />}
        {this.state.displayLoginModal && loginModal}
        <NonMobileContainer show={!showMobileNav}>
          <Nav
            isTeacher={isTeacher}
            loggedIn={loggedIn}
            path={path}
            displaySignUp={bool => this.setState({ displaySignUp: bool })}
            displayLogin={this.displayLogin.bind(this)}
            exitLogin={this.exitLogin.bind(this)}
            logout={this.logout.bind(this)}
            redirect={this.redirect.bind(this)} />
        </NonMobileContainer>        
        <MobileContainer show={showMobileNav}>
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
