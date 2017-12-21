import styled from 'styled-components';
import { lighten10 } from '../../Library/helpers';

const Default = styled.a`
  color: ${props => props.color || 'black'};
  &:hover {
    color: ${props => props.hoverColor || lighten10(props.color)};
  }
  cursor: pointer;
  margin: ${props => props.margin || '0'};
  font-size: 1.5em;
  text-decoration: none;
  transition: visibility 0s, color 0.2s;
`

const Large = Default.extend`
  font-size: 2.25em;
`

const Small = Default.extend`
  font-size: 1.25em;
`

const Link = {
  default: Default,
  large: Large,
  small: Small
}

export default Link;
