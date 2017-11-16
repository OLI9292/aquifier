import styled from 'styled-components';
import { lighten10 } from '../../Library/helpers';

const Default = styled.a`
  color: ${props => props.color || 'white'};
  &:hover {
    color: ${props => lighten10(props.color) || 'white'};
  }
  display: ${props => props.display};
  cursor: pointer;
  text-decoration: none;
  font-size: 1.5em;
  font-weight: 300;
`

const Large = Default.extend`
  font-size: 2.25em;
`

const Link = {
  default: Default,
  large: Large
}

export default Link;
