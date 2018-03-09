import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { color, media } from '../../Library/Styles/index';

class Footer extends Component {
  render() {
    const link = (text, path) => {
      return <Link
        to={path}
        style={{textTransform:'uppercase',textDecoration:'none',color:'black',fontSize:'0.9em'}}>
        {text}
      </Link>
    }

    return (
      <Container hide={this.props.smallScreen}>
        {link('about', '/team')}
        {link('research', '/research')}
        {link('contact', '/contact')}
      </Container>
    );
  }
}

const Container = styled.div`
  align-items: center;
  color: ${color.mediumGray};
  display: ${props => props.hide ? 'none' : 'flex'};
  font-family: BrandonGrotesqueBold;
  height: 120px;
  justify-content: space-evenly;
  width: 100%;
  ${media.phone`
    display: none;
  `};  
`

export default Footer;
