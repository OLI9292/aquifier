import React, { Component } from 'react';
import DefaultButton from './default';
import styled from 'styled-components';
import { color } from '../../Assets/Styles/index';

const IOSURL = "https://itunes.apple.com/us/app/wordcraft-vocabulary-from-greek-and-latin-roots/id1247708707?mt=8";

const ActionButton = (type, redirect) => {
  switch (type) {
    case 'single':
      return <Button color={color.blue} colorHover={color.blue10l} onClick={() => redirect(`/settings-${type}`)}>Single Player</Button>
    case 'multi':
      return <Button color={color.yellow} colorHover={color.yellow10l} onClick={() => redirect(`/settings-${type}`)}>Multiplayer</Button>
    case 'schools':
      return <Button color={color.green} colorHover={color.green10l}>For Schools</Button>
    case 'ios':
      return <Button color={color.black} colorHover={color.black10l}>
        <Link href={IOSURL} target="blank">iOS</Link>
      </Button>
    case 'android':
      return <Button color={color.black} colorHover={color.black10l}>Android</Button>
  }
}

const Button = DefaultButton.extend`
  width: 300px;
  height: 100px;
  font-size: 3em;
  margin: 2%;

  @media (max-width: 768px) {
    width: 180px;
    height: 60px;
    font-size: 2em;
  }

  background-color: ${props => props.color};
  &:hover {
    background-color: ${props => props.colorHover};
  }
`

const Link = styled.a`
  color: inherit;
  width: 100%;
  display: inline-block;
  text-decoration: none;
`

export default ActionButton;
