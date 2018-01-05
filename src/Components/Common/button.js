import React from 'react';
import styled from 'styled-components';
import Link from './link';
import { lighten10 } from '../../Library/helpers';
import { color, breakpoints } from '../../Library/Styles/index';
import GLOBAL from '../../Library/global';

const Default = styled.button`
  &:focus {
    outline: 0;
  }
  background-color: ${props => props.color || color.blue};
  &:hover {
    background-color: ${props => lighten10(props.color) || props.color};
  }
  margin: ${props => props.margin || '0'};  
  vertical-align: ${props => props.verticalAlign || 'baseline'};
  text-align: center;
  border-radius: 10px;
  padding: 0px 15px;
  border-width: 0px;
  color: white;
  font-family: BrandonGrotesque;
  cursor: pointer;
  transition: 0.2s;
  line-height: 1em;
`

const ExtraLargeButton = Default.extend`
  height: 90px;
  min-width: 240px;
  font-size: 1.8em;
`

const LargeButton = Default.extend`
  height: 70px;
  min-width: 180px;
  font-size: 1.6em;
`

const MediumButton = Default.extend`
  height: 60px;
  min-width: 150px;
  font-size: 1.4em;
`

const SmallButton = Default.extend`
  height: 50px;
  min-width: 120px;
  font-size: 1.2em;
`

const ExtraSmallButton = Default.extend`
  height: 40px;
  min-width: 90px;
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

const iOS = (style = {}) => {
  return <MediumButton color={color.black} style={style}>
    <Link.default style={{fontSize:'inherit'}} href={GLOBAL.IOSURL} target='blank' color={'white'}>
      <LinkContent>
        <img alt='iOS' style={{height: '75%', marginRight: '5%',width: 'auto'}} src={require('../../Library/Images/apple-logo.png')} />
        <LinkText>iOS</LinkText>
      </LinkContent>
    </Link.default>
  </MediumButton>
}

const imageAndText = (src, text) => {
  return <Content>
    <Image src={src} />
    <ContentText>{text}</ContentText>
  </Content>;
}

const Content = styled.div`
  width: 90%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Image = styled.img`
  height: 75%;
  margin-right: 5%;
  width: auto;
`

const ContentText = styled.p`
  display: table-cell;
  vertical-align: middle;
`

const Button = {
  extraLarge: ExtraLargeButton,
  large: LargeButton,
  medium: MediumButton,
  small: SmallButton,
  extraSmall: ExtraSmallButton,
  iOS: iOS,
  imageAndText: imageAndText
}

export default Button;
