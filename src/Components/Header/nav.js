import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

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

    const links = (() => {
      return <div style={{display:'flex',width:'100%',alignItems:'center',justifyContent:'space-between'}}>
        <LeftLinksContainer show={loggedIn}>
          <Link to={'/'}>
            <LinkText>
              HOME
              <Highlight show={isPlay} />
            </LinkText>
          </Link>

          <Link to={'/progress'}>
            <LinkText>
              PROGRESS
              <Highlight show={isProgress} />
            </LinkText>
          </Link>

          <Link to={'/leaderboards'}>
            <LinkText>
              LEADERBOARDS
              <Highlight show={isLeaderboards} />
            </LinkText>
          </Link>
        </LeftLinksContainer>
        {
          loggedIn
          ?
          <LinkText onClick={() => this.props.logout()}>
            LOGOUT
          </LinkText>  
          :
          <div>
            <Link to={'/start-free-trial'}>
              <LinkText style={{marginRight:'10px'}}>
                START FREE TRIAL
              </LinkText>
            </Link>

            <LinkText onClick={() => this.props.displayLogin()}>
              LOGIN
            </LinkText>
          </div>
        }
      </div>
    })();

    return (
      <Container isHome={isHome}>
        <div style={{width:'90%',maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{display:'flex',width:'100%',alignItems:'center',height:'90px'}}>
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
  height: 90px;
  background: url(${background}) no-repeat center center;
  background-size: 100% auto;
` 

const LeftLinksContainer = styled.div`
  display: flex;
  opacity: ${props => props.show ? 1 : 0};
  pointer-events: ${props => props.show ? 'auto' : 'none'};
  align-items: center;
  justify-content: space-between;
  width: 325px;
`

const FullLogo = styled.h2`
  font-family: BrandonGrotesqueBold;
  font-size: 2em;
  letter-spacing: 1px;
  margin-right: 5%;
  cursor: pointer;
`

const LinkText = styled.div`
  font-family: BrandonGrotesqueBold;
  position: relative;
  cursor: pointer;
  display: inline-block;
  color: black;
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
