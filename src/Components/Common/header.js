import styled from 'styled-components';
import { color } from '../../Library/Styles/index';

const Default = styled.p`
  font-size: 1.4em;
  font-family: BrandonGrotesqueBold;
  letter-spacing: 2px;  
  text-transform: uppercase;
  color: ${color.gray2};
  text-transform: uppercase;
`

const Large = Default.extend`
  font-size: 1.75em;
`

const Small = Default.extend`
  font-size: 1em;
  letter-spacing: 1px;
`

const ExtraSmall = Default.extend`
  font-size: 0.8em;
  letter-spacing: 1px;
`

const Header = {
  large: Large,
  medium: Default,
  small: Small,
  extraSmall: ExtraSmall
}

export default Header;
