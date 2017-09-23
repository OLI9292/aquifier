import React, { Component } from 'react';
import styled from 'styled-components';

const DefaultButton = styled.button`
  line-height: 1em;
  &:focus {
    outline: 0;
  }
  border-radius: 10px;
  border-width: 0px;
  color: white;
  cursor: pointer;
  font-family: BrandonGrotesque;
  transition: 0.2s;
`

const ExtraLargeButton = DefaultButton.extend`
  width: 400px;
  height: 100px;
  font-size: 3em;

  @media (max-width: 768px) {
    width: 300px;
    height: 100px;
    font-size: 2em;
  }
`

const LargeButton = DefaultButton.extend`
  width: 270px;
  height: 90px;
  font-size: 2.5em;

  @media (max-width: 768px) {
    width: 210px;
    height: 70px;
    font-size: 2em;
  }
`

const MediumButton = DefaultButton.extend`
  width: 210px;
  height: 70px;
  font-size: 2em;
`

const Buttons = {
  extraLarge: ExtraLargeButton,
  large: LargeButton,
  medium: MediumButton
}

export default Buttons;
