import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { color, media } from '../../Library/Styles/index';

class Footer extends Component {
  render() {
    const link = (text, path) => {
      return <Link
        to={path}
        style={{textTransform:'uppercase',textDecoration:'none',color:color.gray2,fontSize:'0.75em',letterSpacing:'1px'}}>
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
  display: ${props => props.hide ? 'none' : 'flex'};
  font-family: BrandonGrotesqueBold;
  height: 120px;
  justify-content: space-evenly;
  width: 80%;
  margin: 0 auto;
  ${media.phone`
    display: none;
  `};  
`

export default Footer;
