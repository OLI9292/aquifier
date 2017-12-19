import React, { Component } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router';

import { color } from '../../Library/Styles/index';
import Login from './login';
import Navigation from './navigation';
import { shouldRedirect } from '../../Library/helpers'

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  exitLogin() {
    this.setState({ displayLogin: false });
  }

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }

    return (
      <div style={{backgroundColor:'white',height:'90px',width:'100%'}}>
        <Content>
          <Title onClick={() => this.setState({ redirect: '/' })}>
            WORDCRAFT
          </Title>

          {
            this.state.displayLogin &&
            <div>
              <Login exitLogin={this.exitLogin.bind(this)}/>
              <DarkBackground onClick={this.exitLogin.bind(this)} />
            </div>
          }

          <Navigation clickedLogin={() => this.setState({ displayLogin: true })} />
        </Content>
      </div>
    );
  }
}

const Content = styled.div`
  width: 95%;
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
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

const Title = styled.h1`
  color: ${color.yellow};
  font-size: 2.5em;
  cursor: pointer;
  margin-top: 20px;
  @media (max-width: 600px) {
    font-size: 1.5em;
  }
`

export default Header;
