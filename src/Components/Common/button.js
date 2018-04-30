import styled from 'styled-components';
import { color } from '../../Library/Styles/index';

const Default = styled.button`
  &:focus {
    outline: 0;
  }
  background-color: ${props => props.bColor || color.mainBlue};
  text-align: center;
  border-radius: 40px;
  padding: 0px 25px;
  border-width: 0px;
  color: ${props => props.fColor || 'white'};
  font-family: BrandonGrotesqueBold;
  cursor: pointer;
  height: 60px;
  line-height: 60px;
  font-size: 1em;
  text-transform: uppercase;
  letter-spacing: 2px;
`

const Large = Default.extend`
  height: 70px;
  line-height: 70px;
  width: 180px;
  font-size: 1.4em;
`

const Small = Default.extend`
  height: 45px;
  line-height: 45px;
  width: 150px;
  font-size: 1em;
  letter-spacing: 0.85px;
`

const ExtraSmall = Default.extend`
  height: 40px;
  line-height: 40px;
  width: 120px;
  font-size: 0.7em;
  letter-spacing: 1px;
`

const Button = {
  large: Large,
  medium: Default,
  small: Small,
  extraSmall: ExtraSmall
}

export default Button;
