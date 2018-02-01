import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Redirect } from 'react-router';

import { color } from '../../Library/Styles/index';
import { shouldRedirect } from '../../Library/helpers';

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  redirect(path) {
    this.setState({ redirect: path });
  }  

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }

    const link = (text, path) => {
      return <Link
        to={path}
        style={{textDecoration:'none',color:color.gray,fontFamily:'BrandonGrotesque',fontSize:'0.9em'}}>
        {text}
      </Link>
    }

    return (
      <Container hide={this.props.smallScreen}>
        {link('About', '/about')}
        {link('Methodology', '/methodology')}
        {link('Partners', '/partners')}
        {link('support@playwordcraft.com', 'mailto:support@playwordcraft.com')}
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
  width: 100%;
`

export default Footer;
