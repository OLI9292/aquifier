import React, { Component } from 'react';
import styled from 'styled-components';

import Button from '../Common/button';
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
          We noticed you’re on a mobile device. You’ll have a much better time if you use the mobile app. Get it below. If that’s not possible, try it out on a laptop.
        </Text>
        <ButtonsContainer>
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
  font-size: 1.25em;
  height: 5%;
  text-align: center;
  width: 85%;
  margin: auto;
`

const ButtonsContainer = styled.div`
  margin-top: 50%;
  text-align: center;
`

const ReturnButton = Button.medium.extend`
  margin-top: 20px;
  background-color: white;
  color: black;
`

export default MobilePopup;
