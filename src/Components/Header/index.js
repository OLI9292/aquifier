import React, { Component } from 'react';
import styled from 'styled-components';
import logo from '../../Library/Images/logo.png';
import { color } from '../../Library/Styles/index';
import { Redirect } from 'react-router';
import _ from 'underscore';

const IOSURL = "https://bit.ly/playwordcraft";

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      userId: localStorage.getItem('userId'),
      isTeacher: !_.isNull(localStorage.getItem('classId'))
    };
  }

  handleClick() {
    if (!window.location.href.match(/dashboard|profile/g)) {
      const redirect = this.state.isTeacher ? '/dashboard' : `/profile/${this.state.userId}`;
      this.setState({ redirect });
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect} />;
    }

    return (
      <Layout>
        <Title onClick={() => this.setState({ redirect: '/' })}>WORDCRAFT</Title>
        <Nav>
          <Link color={color.green} colorHover={color.green10l} onClick={() => this.setState({ redirect: '/' })}>Home</Link>
          {
            this.state.userId &&
            <Link color={color.orange} colorHover={color.orange10l} onClick={() => this.handleClick()}>
              {this.state.isTeacher ? 'My Class' : 'My Progress'}
            </Link>
          }
          <Link color={color.red} colorHover={color.red10l}>
            <a style={{color: 'inherit', textDecoration: 'inherit'}} href='mailto:support@playwordraft.com'>Support</a>
          </Link>
        </Nav>
      </Layout>
    );
  }
}

const Title = styled.h1`
  color: ${color.yellow};
  font-size: 2.25em;
  cursor: pointer;
  margin-top: 15px;
`

const Layout = styled.div`
  background-color: white;
  position: fixed;
  height: 75px;
  width: 100%;
  min-width: 600px;
  display: flex;
  justify-content:space-around;
`

const Logo = styled.img`
  float: left;
  cursor: pointer;
  height: 50%;
  padding-left: 2%;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
`

const Nav = styled.div`
  margin-top: 25px;
`

const Link = styled.a`
  color: ${props => props.color};
  &:hover {
    color: ${props => props.colorHover};
  }
  cursor: pointer;
  text-decoration: none;
  font-size: 1.5em;
  font-weight: 300;
  margin-left: 25px;
`

export default Header;
