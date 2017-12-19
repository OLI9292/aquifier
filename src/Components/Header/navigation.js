import { connect } from 'react-redux'
import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';

import { color } from '../../Library/Styles/index';
import Link from '../Common/link';
import LocalStorage from '../../Models/LocalStorage'
import { isHome, shouldRedirect } from '../../Library/helpers';

import { logoutUser } from '../../Actions/index';

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, false);
  }

  clickedStartFreeTrial() {
    isHome()
      ? window.scrollTo({ top: 2875, left: 0, behavior: 'smooth'})
      : this.setState({ redirect: '/startfreetrial' });
  }  

  handleClick = e => {
    const displayDropdown = ReactDOM.findDOMNode(this).contains(e.target) ? !this.state.displayDropdown : false;
    this.setState({ displayDropdown });
  }

  clickedLogout() {
    LocalStorage.logout();
    this.props.dispatch(logoutUser());
  }

  display(link) {
    const shouldDisplay = (() => {
      switch (link) {
        case 'profile': return this.props.user && !this.props.user.isTeacher
        case 'classes': return this.props.user && this.props.user.isTeacher
        case 'lessons': return this.props.user && this.props.user.role === 'admin'
        case 'wordLists': return this.props.user && this.props.user.role === 'admin'
        default: return false
      }
    })()
    return shouldDisplay ? 'block' : 'none';
  }

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }

    const dropdown = (() => {
      return <DropdownContainer hide={!this.state.displayDropdown}>
        <Link.default style={{color:color.purple,display:this.display('profile')}}
          onClick={() => this.setState({ redirect: `/profile/${this.props.userId}`})} 
          >Progress</Link.default>

        <Link.default style={{color:color.purple,display:this.display('classes')}}
          onClick={() => this.setState({ redirect: '/classes' })}
          >Class</Link.default>

        <Link.default style={{color:color.purple,display:this.display('lessons')}}
          onClick={() => this.setState({ redirect: '/lessons'})}
          >Lessons</Link.default>

        <Link.default style={{color:color.purple,display:this.display('wordLists')}}
          onClick={() => this.setState({ redirect: '/word-lists'})}
          >Word Lists</Link.default>

        <Link.default color={color.red} onClick={this.clickedLogout.bind(this)}>
          Logout
        </Link.default>
      </DropdownContainer>
    })();

    const loggedInNavigation = (() => {
      return <div style={{marginTop:'30px',cursor:'pointer'}}>
        <Link.default color={color.blue}>
          Me
        </Link.default>
        <img alt='dropdown' src={require('../../Library/Images/dropdown.png')}
          style={{display:'inline-block',height:'25px',marginTop:'-10px',verticalAlign:'middle'}} />
        {dropdown}
      </div>
    })(); 

    const loggedOutNavigation = (() => {
      return <div style={{marginTop:'30px'}}>
        <Link.default color={color.green} onClick={this.clickedStartFreeTrial.bind(this)}>
          Start Free Trial
        </Link.default>
        <Link.default color={color.blue} onClick={this.props.clickedLogin}>
          Login
        </Link.default>
      </div>
    })();

    return (
      <div>
        {this.props.session ? loggedInNavigation : loggedOutNavigation}
      </div>
    );
  }
}

const DropdownContainer = styled.div`
  background-color: white;
  border: 5px solid ${color.lightGray};
  border-radius: 10px;
  padding: 5px;
  position: relative;
  width: 100px;
  visibility: ${props => props.hide ? 'hidden' : 'visible'};
  z-index: 2000;
`

const mapStateToProps = (state, ownProps) => ({
  session: state.entities.session,
  user: _.first(_.values(state.entities.user))
});

export default connect(mapStateToProps)(Navigation);
