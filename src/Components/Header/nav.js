import _ from 'underscore';
import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { color, media } from '../../Library/Styles/index';
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
      isTeacher,
      isSchoolAdmin
    } = this.props;

    const link = _path => {
      const highlight = _path === "/championships";
      const style = highlight ? {backgroundColor:"white",borderRadius:"5px",padding:"5px 10px"} : {};
      return <Link key={_path} to={_path} style={style}>
        <LinkText highlight={highlight}>
          {_path.substring(1).replace('-',' ').toUpperCase()}
          <Highlight show={path === _path} highlight={highlight} />
        </LinkText>
      </Link>
    }

    const paths = isSchoolAdmin
      ? ['/my-district','/leaderboards']
        : isTeacher
          ? ['/setup-game','/my-class','/leaderboards']
          : ['/home','/profile','/leaderboards', '/championships'];

    const links = (() => {
      return <LinksContainer loggedIn={loggedIn}>
        {
          loggedIn
          &&
          <LeftLinksContainer>
            {_.map(paths, link)}
          </LeftLinksContainer>
        }
        {
          loggedIn
          ?
          <LinkText onClick={() => this.props.logout()}>
            logout
          </LinkText>  
          :
          <div style={{display:'flex'}}>
            <LinkText
              onClick={() => this.props.displaySignUp(true)}
              style={{marginRight:'20px'}}>
              sign up
            </LinkText>            
            <LinkText onClick={() => this.props.displayLogin()}>
              login
            </LinkText>
          </div>
        }
      </LinksContainer>
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

const LinksContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: ${props => props.loggedIn ? 'space-between' : 'flex-end'};
`

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
  align-items: center;
  justify-content: space-between;
  width: 400px;
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
  color: ${props => props.highlight ? color.green : "black"};
  text-transform: uppercase;
  font-size: 0.9em;
`

const Highlight = styled.div`
  display: ${props => props.show ? '' : 'none'};
  width: 100%;
  height: 2px;
  background-color: ${props => props.highlight ? color.green : "black"};
  position: absolute;
  margin-top: -22px;
  border-radius: 1px;
`

export default Nav;
