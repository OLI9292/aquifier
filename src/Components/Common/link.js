import styled from 'styled-components';
import { lighten10 } from '../../Library/helpers';
import { color } from '../../Library/Styles/index';

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

export default Default;
