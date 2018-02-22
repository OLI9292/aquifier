import React, { Component } from 'react';
import styled from 'styled-components';

import { color } from '../../Library/Styles/index';

class MobileNav extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const path = this.props.path;

    return (
      <Container isHome={path === '/home'}>
        <Option onClick={() => this.props.redirect('/home')}>
          <Image src={require(`../../Library/Images/play-${path === '/home' ? 'blue' : 'gray'}.png`)} />
          <Title selected={path === '/home'}>
            PLAY
          </Title>
        </Option>

        <Option onClick={() => this.props.redirect('/profile')}>
          <Image src={require(`../../Library/Images/wizard-${'gray'}.png`)} />
          <Title selected={path === '/profile'}>
            ME
          </Title>        
        </Option>

        <Option onClick={() => this.props.redirect('/leaderboards')}>
          <Image src={require(`../../Library/Images/leaderboard-${path === '/leaderboards' ? 'blue' : 'gray'}.png`)} />
          <Title selected={path === '/leaderboards'}>
            COMPETE
          </Title>
        </Option>
      </Container>
    );
  }
}

const Container = styled.div`
  align-items: center;
  background-color: ${color.lightestGray};
  bottom: 0;
  display: flex;
  height: 80px;
  justify-content: space-around;
  position: fixed;
  width: 100%;
  z-index: 1000;
` 

const Option = styled.div`
  text-align: center;
  flex: 1;
`

const Title = styled.p`
  color: ${color.blue};
  height: 0px;
  line-height: 0px;
  font-size: 0.9em;
  margin: 5px 0px;
  display: ${props => props.selected ? '' : 'none'};
`

const Image = styled.img`
  height: 45px;
  width: auto;
`

export default MobileNav;
