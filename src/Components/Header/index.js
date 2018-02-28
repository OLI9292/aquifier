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
import { logoutUser } from '../../Actions/index';

import { PHONE_MAX_WIDTH } from '../../Library/Styles/index';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.checkWindowSize = this.checkWindowSize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.checkWindowSize);
    this.checkWindowSize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.checkWindowSize);
  }  

  checkWindowSize() {
    const smallScreen = document.body.clientWidth < PHONE_MAX_WIDTH;
    this.setState({ smallScreen });
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
      this.props.dispatch(logoutUser());
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
          smallScreen={this.state.smallScreen}
          exitLogin={this.exitLogin.bind(this)} />
        <DarkBackground
          onClick={() => this.exitLogin()} />
      </div>
    })()    

    // TODO: - change smallScreen && loggedIn
    const NavComponent = (this.state.smallScreen && loggedIn && !isTeacher) ? MobileNav : Nav;

    return (
      <div>
        {loginModal}
        <NavComponent
          isTeacher={isTeacher}
          loggedIn={loggedIn}
          path={path}
          displayLogin={this.displayLogin.bind(this)}
          exitLogin={this.exitLogin.bind(this)}
          logout={this.logout.bind(this)}
          redirect={this.redirect.bind(this)} />
      </div>      
    );
  }
}

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
  const isAdmin = loggedIn && user.role === 'admin';

  return {
    user: user,
    loggedIn: loggedIn,
    isTeacher: isTeacher,
    isAdmin: isAdmin
  };
};

export default connect(mapStateToProps)(Header);
