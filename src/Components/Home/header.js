import React, { Component } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router';

import Login from './login';
import { color } from '../../Library/Styles/index';
import { sleep, shouldRedirect } from '../../Library/helpers';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  exitLogin = async () => {
    await sleep(2000);
    this.setState({ displayLoginModal: false });
  }  

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }

    return (
      <div>
        <h2 style={{fontFamily:'BrandonGrotesqueBold',fontSize:'2em',marginLeft:'10%'}}>
          WORDCRAFT
        </h2>

        <LinksContainer>
          <p style={{display:'none',cursor:'pointer'}}>
            ABOUT              
          </p> 
          <p
            onClick={() => this.setState({ redirect: '/start-free-trial' })}
            style={{cursor:'pointer',display: this.props.smallScreen ? 'none' : 'inline-block'}}>
            START FREE TRIAL
          </p>
          <p
            onClick={() => this.setState({ displayLoginModal: true })}
            style={{cursor:'pointer',display: this.props.smallScreen ? 'none' : 'inline-block'}}>
            LOGIN
          </p>
        </LinksContainer>      

        {
          this.state.displayLoginModal &&
          <div>
            <Login
              exitLogin={this.exitLogin.bind(this)} />
            <DarkBackground
              onClick={this.exitLogin.bind(this)} />
          </div>
        }        
      </div>
    );
  }
}

const LinksContainer = styled.div`
  display: flex;
  width: 35%;
  min-width: 300px;
  position: absolute;
  right: 5%;
  justify-content: space-evenly;
  top: -5px;
  font-family: BrandonGrotesqueBold;
  @media (max-width: 900px) {
    width: 100%;
    position: static;
  }    
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

export default Header;
