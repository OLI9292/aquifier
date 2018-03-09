import _ from 'underscore';
import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { media } from '../../Library/Styles/index';
import background from '../../Library/Images/header-bg.png';

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { 
      path,
      loggedIn,
      isTeacher
    } = this.props;

    const link = _path => {
      return <Link key={_path} to={_path}>
        <LinkText>
          {_path.substring(1).replace('-',' ').toUpperCase()}
          <Highlight show={path === _path} />
        </LinkText>
      </Link>
    }

    const paths = isTeacher
      ? ['/setup-game','/my-class','/leaderboards']
      : ['/home','/profile','/leaderboards'];

    const links = (() => {
      return <div style={{display:'flex',width:'100%',alignItems:'center',justifyContent:'space-between'}}>
        <LeftLinksContainer
          width={'325px'}
          show={loggedIn}>
          {_.map(paths, link)}
        </LeftLinksContainer>
        {
          loggedIn
          ?
          <LinkText onClick={() => this.props.logout()}>
            logout
          </LinkText>  
          :
          <LinkText style={{display:'block',textAlign:'right'}} onClick={() => this.props.displayLogin()}>
            login
          </LinkText>
        }
      </div>
    })();

    return (
      <Container isHome={path === '/'}>
        <div style={{width:'90%',margin:'0 auto'}}>
          <div style={{display:'flex',width:'100%',alignItems:'center',height:'90px'}}>
            <Link style={{textDecoration:'none',color:'black'}} to={'/'}>
              <FullLogo>
                WORDCRAFT
              </FullLogo>
            </Link>
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
  background: ${props => props.isHome ? '' : `url(${background}) no-repeat center center`};
  background-size: 100% auto;
  z-index: 2;
  ${media.phone`
    background-size: auto 100%;
  `};    
` 

const LeftLinksContainer = styled.div`
  display: flex;
  opacity: ${props => props.show ? 1 : 0};
  pointer-events: ${props => props.show ? 'auto' : 'none'};
  align-items: center;
  justify-content: space-between;
  width: ${props => props.show ? '300px' : '0'};
  margin-left: 25px;
`

const FullLogo = styled.h2`
  font-family: BrandonGrotesqueBold;
  font-size: 1.75em;
  letter-spacing: 2px;
  margin-right: 5%;
  cursor: pointer;
`

const LinkText = styled.div`
  font-family: BrandonGrotesqueBold;
  position: relative;
  cursor: pointer;
  display: inline-block;
  color: black;
  text-transform: uppercase;
  font-size: 0.9em;
`

const Highlight = styled.div`
  display: ${props => props.show ? '' : 'none'};
  width: 100%;
  height: 2px;
  background-color: black;
  position: absolute;
  margin-top: -22px;
  border-radius: 1px;
`

export default Nav;
