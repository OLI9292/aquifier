import styled from 'styled-components';

const Default = styled.h1`
  font-size: 1.2em;
  font-family: ${props => props.thin ? 'BrandonGrotesque' : 'BrandonGrotesqueBold'};
  letter-spacing: 2px;  
  text-transform: ${props => props.noUpcase ? '' : 'uppercase'};
`

const Large = Default.extend`
  font-size: 1.75em;
`

const ExtraLarge = Default.extend`
  font-size: 2.25em;
`

const Small = Default.extend`
  font-size: 1.2em;
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
