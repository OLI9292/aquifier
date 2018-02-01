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

const imageAndText = (src, text) => {
  return <div style={{width:'90%',height:'90%',display:'flex',justifyContent:'center',alignItems:'center'}}>
    <img src={src} style={{height:'75%',marginRight:'5%',width:'auto'}} />
    <p style={{display:'table-cell',verticalAlign:'middle'}}>{text}</p>
  </div>;
}

const Button = {
  large: LargeButton,
  medium: MediumButton,
  small: SmallButton,
  imageAndText: imageAndText
}

export default Button;
