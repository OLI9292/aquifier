import _ from 'underscore';
import React, { Component } from 'react';
import styled from 'styled-components';

import { color } from '../../Library/Styles/index';

const LINKS = [
  {
    title: 'play',
    path: '/home',
    img: 'bungalow'
  },
  {
    title: 'me',
    path: '/profile',
    img: 'stairs'
  },
  {
    title: 'leaderboards',
    path: '/leaderboards',
    img: 'trophy'
  }
]

class MobileNav extends Component {
  render() {
    const link = data => {
      const selected = this.props.path === data.path;
      const image = require('../../Library/Images/' + data.img + (selected ? '' : '-light') + '-blue.png');
      return <Option onClick={() => this.props.redirect(data.path)}>
        <Image src={image} />
        <Title selected={selected}>
          {data.title.toUpperCase()}
        </Title>
      </Option>
    }

    return (
      <div>
        {this.props.path === '/profile' && <Logout onClick={() => this.props.logout()}>logout</Logout>}
        <Container>{_.map(LINKS, link)}</Container>
      </div>
    );
  }
}

const Container = styled.div`
  align-items: center;
  background: linear-gradient(white, ${color.navBlueBg});
  bottom: 0;
  display: flex;
  height: 100px;
  justify-content: space-around;
  position: fixed;
  width: 100%;
  z-index: 1000;
` 

const Logout = styled.p`
  position: absolute;
  top: 15px;
  right: 20px;
  margin: 0;
  cursor: pointer;
  font-family: BrandonGrotesqueBold;
  letter-spacing: 1px;
  font-size: 0.9em;
  text-transform: uppercase;
`

const Option = styled.div`
  text-align: center;
  flex: 1;
  cursor: pointer;
`

const Title = styled.p`
  color: ${props => props.selected ? color.navBlue : color.lightNavBlue};
  height: 0px;
  line-height: 5px;
  margin: 10px 0px;
`

const Image = styled.img`
  height: 45px;
  width: auto;
`

export default MobileNav;
