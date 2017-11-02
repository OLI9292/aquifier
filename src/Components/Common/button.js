import React from 'react';
import styled from 'styled-components';
import Link from './link';
import { lighten10 } from '../../Library/helpers';
import { color } from '../../Library/Styles/index';
import GLOBAL from '../../Library/global';

const Default = styled.button`
  &:focus {
    outline: 0;
  }
  background-color: ${props => props.color || color.blue};
  &:hover {
    background-color: ${props => lighten10(props.color) || color.blue10l};
  }
  margin: ${props => props.margin};  
  vertical-align: ${props => props.verticalAlign};
  border-radius: 10px;
  border-width: 0px;
  color: white;
  cursor: pointer;
  font-family: BrandonGrotesque;
  transition: 0.2s;
  line-height: 1em;
`

const ExtraLargeButton = Default.extend`
  width: 400px;
  height: 100px;
  font-size: 3em;

  @media (max-width: 768px) {
    width: 300px;
    height: 100px;
    font-size: 2em;
  }
`

const LargeButton = Default.extend`
  width: 270px;
  height: 90px;
  font-size: 2.5em;

  @media (max-width: 1000px), ( max-height: 700px ) {
    width: 210px;
    height: 75px;
    font-size: 2em;
  }
`

const MediumButton = Default.extend`
  width: 225px;
  height: 60px;
  font-size: 1.75em;
  @media (max-width: 1100px) {
    height: 50px;
    width: 175px;
    font-size: 1.5em;
  }
  @media (max-width: 450px) {
    font-size: 1.2em;
    height: 40px;
    width: 125px;
  }  
`

const SmallButton = Default.extend`
  width: 140px;
  height: 50px;
  font-size: 1.5em;
`

const SmallestButton = Default.extend`
  width: 55px;
  height: 25px;
  font-size: 1em;
`

const LinkContent = styled.div`
  width: 90%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const LinkText = styled.p`
  display: table-cell;
  vertical-align: middle;
`

const iOS = () => {
  return <MediumButton color={color.black}>
    <Link.default href={GLOBAL.IOSURL} target='blank' color={'white'}>
      <LinkContent>
        <img style={{height: '75%', marginRight: '5%',width: 'auto'}} src={require('../../Library/Images/apple-logo.png')} />
        <LinkText>iOS</LinkText>
      </LinkContent>
    </Link.default>
  </MediumButton>
}



const Button = {
  extraLarge: ExtraLargeButton,
  large: LargeButton,
  medium: MediumButton,
  small: SmallButton,
  smallest: SmallestButton,
  iOS: iOS
}

export default Button;
