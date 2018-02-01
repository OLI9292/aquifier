import React, { Component } from 'react';
import styled from 'styled-components';

import Dropdown from './dropdown';
import { color } from '../../Library/Styles/index';

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { 
      isHome,
      isPlay,
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
        <div style={{display:'flex',alignItems:'center'}}>
          <Link
            padding
            selected={isPlay}
            onClick={() => this.props.redirect('/')}
            hide={isHome} 
            margin={'0px 0px 0px 25px'}>
            HOME
          </Link>

          <Link
            padding
            selected={isLeaderboards}
            onClick={() => this.props.redirect('/leaderboards')}
            hide={!loggedIn}
            margin={'0px 0px 0px 25px'}>
            LEADERBOARDS
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
                src={require('../../Library/Images/white-arrow-down.png')} />
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
  background-color: ${props => props.isHome ? '' : 'rgba(75,154,236,0.95)'};
  color: ${props => props.isHome ? 'black' : 'white'};
` 

const FullLogo = styled.h2`
  font-family: BrandonGrotesqueBold;
  font-size: 2em;
  letter-spacing: 1px;
  cursor: pointer;
`

const Link = styled.p`
  background-color: ${props => props.padding && props.selected ? color.mainBlue : ''};
  padding: ${props => props.padding ? '5px 15px' : '0'};
  border-radius: 50px;
  cursor: pointer;
  display: ${props => props.hide ? 'none' : 'inline-block'};
  margin: ${props => props.margin};
`

export default Nav;
