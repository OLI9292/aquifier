import React, { Component } from 'react';
import styled from 'styled-components';

import Link from '../Common/link';
import { color } from '../../Library/Styles/index';

class Dropdown extends Component {
  render() {
    return (
      <Container>
        <Link.small hoverColor={color.green} margin={'5px'}
          onClick={() => this.props.redirect('/classes')}
          style={{display:this.props.isTeacher ? 'block' : 'none'}}>
          Class
        </Link.small> 

        <Link.small hoverColor={color.green} margin={'5px'}
          onClick={() => this.props.redirect('/profile')}
          style={{display:this.props.isTeacher ? 'none' : 'block'}}>
          Profile
        </Link.small> 

        <Link.small hoverColor={color.green} margin={'5px'}
          onClick={() => this.props.redirect('/lessons')}
          style={{display:this.props.isTeacher ? 'none' : 'block'}}>
          Lessons
        </Link.small> 

        <Link.small hoverColor={color.green} margin={'5px'}
          onClick={() => this.props.redirect('/word-lists')}
          style={{display:this.props.isAdmin ? 'none' : 'block'}}>
          Word Lists
        </Link.small>                 

        <Link.small hoverColor={color.red} margin={'5px'}
          onClick={() => this.props.logout()}>
          Logout
        </Link.small>                 
      </Container>
    );
  }
}

const Container = styled.div`
  background-color: white;
  border-radius: 5px;
  position: absolute;
  width: 100px;
  padding: 10px 5px;
  margin-left: -40px;
  border: 5px solid ${color.lightGray};
  z-index: 2000;
`

export default Dropdown
