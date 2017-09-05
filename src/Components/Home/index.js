import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';

import ActionButton from '../Buttons/action';
import { color } from '../../Library/Styles/index';
import logo from '../../Library/Images/logo.png';

class Home extends Component {
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
        <Title>WORDCRAFT</Title>
        <Subtitle>Understand, don't memorize, advanced<br />English vocabulary.</Subtitle>
        <Buttons>
          {ActionButton('singlePlayer', this.redirect.bind(this))}
          {ActionButton('multiplayer', this.redirect.bind(this))}
          {ActionButton('education', this.redirect.bind(this))}
        </Buttons>
        <Buttons>
          {ActionButton('ios')}
          {ActionButton('android')}
        </Buttons>
      </Layout>
    );
  }
}

const Layout = styled.div`
  height: 100%;
  width: 100%;
`

const Logo = styled.img`
  height: 20%;
  width: auto;
  display: block;
  margin: auto;
  padding-top: 2.5%;
`

const Title = styled.h2`
  color: ${color.yellow};
  font-size: 3em;
  height: 5%;
  text-align: center;
`

const Subtitle = styled.p`
  font-size: 2em;
  text-align: center;
`

const Buttons = styled.div`
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`

export default Home;
