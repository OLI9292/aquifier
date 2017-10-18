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
          <Link color={color.red}>
            <a style={{color: 'inherit', textDecoration: 'inherit'}} href='mailto:support@gmail.com'>Support</a>
          </Link>
          {
            this.state.userId &&
            <Link color={color.orange} onClick={() => this.handleClick()}>
              {this.state.isTeacher ? 'My Class' : 'My Progress'}
            </Link>
          }
          <Link color={color.green} onClick={() => this.setState({ redirect: '/' })}>Home</Link>
        </Nav>
      </Layout>
    );
  }
}

const Title = styled.h1`
  color: ${color.yellow};
  display: inline-block;
  margin: 5px 0px 0px 50px;
  height: 75px;
  line-height: 75px;
  font-size: 2.25em;
  cursor: pointer;
`

const Layout = styled.div`
  background-color: white;
  position: fixed;
  height: 75px;
  width: 100%;
  min-width: 400px;
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
  height: 100%;
  line-height: 100%;
  margin-right: 30px;
  display: inline-block;
  float: right;
`

const Link = styled.a`
  color: ${props => props.color};
  cursor: pointer;
  text-decoration: none;
  float: right;
  font-size: 1.5em;
  font-weight: 300;
  margin-right: 20px;
  margin-top: 35px;
`

export default Header;
