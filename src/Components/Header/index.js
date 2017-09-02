import React, { Component } from 'react';
import styled from 'styled-components';
import logo from '../../Library/Images/logo.png';
import { color } from '../../Library/Styles/index';
import { Redirect } from 'react-router';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null
    };
  }

  redirect(location) {
    this.setState({ redirect: location })
  }
  
  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect} />;
    }

    return (
      <Layout>
        <Logo src={logo} />
        <Nav>
          <Link color={color.green}>For Schools</Link>
          <Link color={color.black}>iOS App</Link>
          <Link color={color.blue} onClick={() => this.redirect(`/`)}>Home</Link>
        </Nav>
      </Layout>
    );
  }
}

const Layout = styled.div`
  background-color: white;
  height: 10%;
  width: 100%;
  min-width: 400px;
`

const Logo = styled.img`
  float: left;
  height: 50%;
  padding-left: 2%;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
`

const Nav = styled.div`
  height: 100%;
  line-height: 100%;
`

const Link = styled.h4`
  color: ${props => props.color};
  cursor: pointer;
  float: right;
  font-size: 1.5em;
  font-weight: 300;
  margin-right: 3%;
`

export default Header;
