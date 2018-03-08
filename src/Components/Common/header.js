import styled from 'styled-components';
import { color } from '../../Library/Styles/index';

const Default = styled.p`
  font-size: 1.4em;
  font-family: ${props => props.thin ? 'BrandonGrotesque' : 'BrandonGrotesqueBold'};
  letter-spacing: 2px;  
  text-transform: ${props => props.noUpcase ? '' : 'uppercase'};
  color: ${color.gray2};
`

const Large = Default.extend`
  font-size: 1.75em;
`

const ExtraLarge = Default.extend`
  font-size: 2.25em;
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
  extraLarge: ExtraLarge,
  large: Large,
  medium: Default,
  small: Small,
  extraSmall: ExtraSmall
}

export default Header;
