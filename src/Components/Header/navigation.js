import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router';
import CONFIG from '../../Config/main';

import { color, breakpoints } from '../../Library/Styles/index';
import Link from '../Common/link';
import User from '../../Models/User';

class Navigation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayDropdown: false,
      hasAdminAccess: false
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClick, false);

    const userId = User.loggedIn('_id');
    const hasAdminAccess = userId === CONFIG.ADMIN_ID;
    this.setState({ hasAdminAccess });
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, false);
  }

  handleClick = e => {
    const displayDropdown = ReactDOM.findDOMNode(this).contains(e.target) ? !this.state.displayDropdown : false;
    this.setState({ displayDropdown });
  }

  display(link) {
    const shouldDisplay = (() => {
      switch (link) {
        case 'profile': return !this.props.isTeacher
        case 'classes': return this.props.isTeacher
        case 'lessons': return this.state.hasAdminAccess
        case 'wordLists': return this.state.hasAdminAccess
        default: return false
      }
    })()
    return shouldDisplay ? 'block' : 'none';
  }

  render() {
    if (this.state.redirect && !window.location.href.endsWith(this.state.redirect)) {
      return <Redirect push to={this.state.redirect} />;
    }

    const dropdown = () => {
      return <DropdownContainer visibility={this.state.displayDropdown ? 'visible' : 'hidden'}>
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

        <Link.default color={color.red} onClick={() => this.props.logout()}>Logout</Link.default>
      </DropdownContainer>
    }

    const navigation = () => {
      if (this.props.loggedIn) {
        return <NavigationContainer>
          <div>
            <Link.default style={{display: 'inline-block',verticalAlign:'top',color:color.blue}}>
              Me
            </Link.default>
            <DropdownImage src={require('../../Library/Images/dropdown.png')} />
          </div>
          {dropdown()}
        </NavigationContainer>
      } else {
        return <NavigationContainer>
          <Link.default color={color.blue} onClick={() => this.props.login()}>Login</Link.default>
        </NavigationContainer>
      }
    }

    return (
      <Layout>
        {navigation()}
      </Layout>
    );
  }
}

const Layout = styled.div`
  ${breakpoints.smallW} {
    font-size: 0.75em;
  }
`

const DropdownContainer = styled.div`
  width: 100px;
  position: relative;
  z-index: ${props => props.visibility ? 2000 : 0};
  background-color: white;
  border-radius: 10px;
  padding: 5px;
  border: 5px solid ${color.lightGray};
  visibility: ${props => props.visibility};
`

const NavigationContainer = styled.div`
  margin-top: 30px;
  cursor: pointer;
  width: 125px;
`

const DropdownImage = styled.img`
  margin: 4px 0px 0px 5px;
  height: 25px;
  display: inline-block;
`

export default Navigation;
