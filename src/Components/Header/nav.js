import React, { Component } from 'react';
import styled from 'styled-components';

import Dropdown from './dropdown';
import { color } from '../../Library/Styles/index';

import background from '../../Library/Images/header-bg.png';

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { 
      isHome,
      isPlay,
      isProgress,
      isLeaderboards,
      isTeacher,
      isAdmin,
      loggedIn
    } = this.props;

    const profileDropdown = (() => {
      return <Dropdown 
        isTeacher={isTeacher} 
        isAdmin={isAdmin}
        logout={this.props.logout.bind(this)}
        redirect={this.props.redirect.bind(this)} />
    })()

    const links = (() => {
      return <div style={{display:'flex',width:'100%',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'325px'}}>
          <Link
            padding
            onClick={() => this.props.redirect('/')}
            hide={isHome} >
            HOME
            <Highlight show={isPlay} />
          </Link>

          <Link
            padding
            onClick={() => this.props.redirect('/progress')}
            hide={!loggedIn}>
            PROGRESS
            <Highlight show={isProgress} />
          </Link>

          <Link
            padding
            onClick={() => this.props.redirect('/leaderboards')}
            hide={!loggedIn}>
            LEADERBOARDS
            <Highlight show={isLeaderboards} />
          </Link>
        </div>
        <div>
          <div style={{display:loggedIn ? '' : 'none'}}
            onMouseOver={() => this.setState({ displayProfileDropdown: true })}
            onMouseLeave={() => this.setState({ displayProfileDropdown: false })}>
            <div style={{display:'flex',alignItems:'center',padding:'10px 0px'}}>
              <Link margin={'0px 10px 0px 0px'}>
                Oliver
              </Link>   
              <img
                alt={'down-arrow'} 
                style={{width:'20px',height:'auto',cursor:'pointer'}}
                src={require('../../Library/Images/black-arrow-down.png')} />
            </div>
            {this.state.displayProfileDropdown && profileDropdown}
          </div>

          <Link
            onClick={() => this.props.redirect('/start-free-trial')}
            hide={loggedIn}
            margin={'0px 25px 0px 0px'}>
            Start Free Trial
          </Link>

          <Link
            hide={loggedIn}
            onClick={() => this.props.displayLogin()}>
            Login
          </Link>
        </div>
      </div>
    })()  

    return (
      <Container isHome={isHome}>
        <div style={{width:'90%',maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{display:'flex',width:'100%',alignItems:'center',height:'70px'}}>
            <FullLogo onClick={() => this.props.redirect('/')}>
              WORDCRAFT
            </FullLogo>
            {links}
          </div>
        </div>  
      </Container>
    );
  }
}

const Container = styled.div`
  position: ${props => props.isHome ? 'relative' : 'fixed'};
  z-index: 1000;
  width: 100%;
  height: 70px;
  background: url(${background}) no-repeat center center;
  background-size: 100% auto;
` 

const FullLogo = styled.h2`
  font-family: BrandonGrotesqueBold;
  font-size: 2em;
  letter-spacing: 1px;
  margin-right: 5%;
  cursor: pointer;
`

const Link = styled.p`
  font-family: BrandonGrotesqueBold;
  position: relative;
  cursor: pointer;
  display: ${props => props.hide ? 'none' : 'inline-block'};
`

const Highlight = styled.div`
  display: ${props => props.show ? '' : 'none'};
  width: 100%;
  height: 2px;
  background-color: black;
  position: absolute;
  margin-top: -25px;
  border-radius: 1px;
`

export default Nav;
