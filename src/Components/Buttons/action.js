import React from 'react';
import Buttons from './default';
import styled from 'styled-components';
import { color } from '../../Library/Styles/index';
import appleLogo from '../../Library/Images/apple-logo.png';
import androidLogo from '../../Library/Images/android-logo.png';

const IOSURL = "https://itunes.apple.com/us/app/wordcraft-vocabulary-from-greek-and-latin-roots/id1247708707?mt=8";

const ActionButton = (type, redirect) => {
  switch (type) {
    case 'singlePlayer':
      return <Button color={color.blue} colorHover={color.blue10l} onClick={() => redirect('/settings')}>Single Player</Button>
    case 'multiplayer':
      return <Button color={color.yellow} colorHover={color.yellow10l} onClick={() => redirect('/lobby')}>Multiplayer</Button>
    case 'education':
      return <Button color={color.green} colorHover={color.green10l} onClick={() => redirect('/education')}>For Schools</Button>
    case 'ios':
      return <Button color={color.black} colorHover={color.black10l}>
        <Link href={IOSURL} target="blank">
          <Content>
            <Logo src={appleLogo} />
            <Text>iOS</Text>
          </Content>
        </Link>
      </Button>
    case 'android':
      return <Button color={color.black} colorHover={color.black10l} onClick={() => alert('Wordcraft on Android is coming soon!')}>
        <Content>
          <Logo src={androidLogo} />
          <Text>Android</Text>
        </Content>
      </Button>
    default:
      return
  }
}

const Content = styled.div`
  width: 90%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Logo = styled.img`
  height: 75%;
  margin-right: 5%;
  width: auto;
`

const Button = Buttons.large.extend`
  margin: 1%;
  background-color: ${props => props.color};
  &:hover {
    background-color: ${props => props.colorHover};
  }
`

const Text = styled.p`
  display: table-cell;
  vertical-align: middle;
`

const Link = styled.a`
  color: inherit;
  width: 100%;
  height: 100%;
  text-decoration: none;
`

export default ActionButton;
