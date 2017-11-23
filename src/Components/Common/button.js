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
  border-radius: 10px;
  border-width: 0px;
  color: white;
  font-family: BrandonGrotesque;
  cursor: pointer;
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
  width: 250px;
  height: 80px;
  font-size: 2em;

  ${breakpoints.largeWH} {
    width: 180px;
    height: 60px;
    font-size: 1.5em;
  }
`

const MediumButton = Default.extend`
  width: 180px;
  height: 60px;
  font-size: 1.75em;

  ${breakpoints.largeWH} {
    width: 150px;
    height: 50px;
    font-size: 1.5em;
  }
`

const MediumLongButton = MediumButton.extend`
  width: 320px;

  ${breakpoints.largeWH} {
    width: 250px;
  }
`

const SmallButton = Default.extend`
  width: 150px;
  height: 50px;
  font-size: 1.5em;
`

const ExtraSmallButton = Default.extend`
  width: 120px;
  height: 50px;
  font-size: 1.25em;
`

const SmallestButton = Default.extend`
  width: 60px;
  height: 30px;
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
  mediumLong: MediumLongButton,
  small: SmallButton,
  extraSmall: ExtraSmallButton,
  smallest: SmallestButton,
  iOS: iOS,
  imageAndText: imageAndText
}

export default Button;
