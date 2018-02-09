import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';

import Button from '../Common/button';
import { color } from '../../Library/Styles/index';

class MobilePopup extends Component {
  constructor(props) {
    super(props);
    this.state={}
  }

  handleClick() {
    this.props.removeSelf();
  }

  render() {
    if (this.state.redirect && !window.location.href.endsWith(this.state.redirect)) {
      return <Redirect push to={this.state.redirect} />;
    }

    return (
      <Layout>
        <Title>Sorry to interrupt!</Title>
        <Text>
          Email us at support@playwordcraft.com or call us at (617) 429-8906 to set up Wordcraft in your school. Click below to play the solo version on an iPhone.
        </Text>
        <ButtonsContainer>
          <Button.iOS style={{display:'block',margin:'0 auto'}}/>
          <Button.medium style={{color:'black',backgroundColor:'white',display:'block',margin:'0 auto',marginTop:'10px'}} onClick={() => this.setState({ redirect: '/' })}>Back</Button.medium>
        </ButtonsContainer>
      </Layout>
    );
  }
}

const Layout = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(47,128,237, 0.97);
`

const Title = styled.h1`
  color: ${color.yellow};
  text-align: center;
`

const Text = styled.p`
  color: white;
  font-size: 1.25em;
  height: 5%;
  text-align: center;
  width: 85%;
  margin: 0 auto;
`

const ButtonsContainer = styled.div`
  margin-top: 50%;
  text-align: center;
`

export default MobilePopup;
