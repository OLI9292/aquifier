import React, { Component } from 'react';
import styled from 'styled-components';

import ActionButton from '../Buttons/action';
import Buttons from '../Buttons/default';
import { color } from '../../Library/Styles/index';

class MobilePopup extends Component {
  handleClick() {
    this.props.removeSelf();
  }

  render() {
    return (
      <Layout>
        <Title>Sorry to interrupt!</Title>
        <Text>
          We noticed you're on a mobile device.  You'll have a much better time playing the mobile app.  Get it here.
        </Text>
        <ButtonsContainer>
          {ActionButton('ios')}
          <ReturnButton onClick={this.handleClick.bind(this)}>Back</ReturnButton>
        </ButtonsContainer>
      </Layout>
    );
  }
}

const Layout = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: fixed;
  background-color: rgba(47,128,237, 0.97);
`

const Title = styled.h1`
  color: ${color.yellow};
  text-align: center;
`

const Text = styled.p`
  color: white;
  font-size: 1.5em;
  height: 5%;
  text-align: center;
  width: 85%;
  margin: auto;
`

const ButtonsContainer = styled.div`
  margin-top: 50%;
  text-align: center;
`

const ReturnButton = Buttons.medium.extend`
  margin-top: 20px;
  background-color: white;
  color: black;
`

export default MobilePopup;
