import styled from 'styled-components';
import { color } from '../../Library/Styles/index';

const Default = styled.textarea`
  background-color: white;
  border: 2px solid ${color.lightGray};
  border-radius: 5px;
  font-family: BrandonGrotesque;
  &:focus {
    outline: 0;
  }
  resize: none;
  transition: 0.2s;
  box-sizing: border-box;
  padding-left: 10px;
`

const Medium = Default.extend`
  width: 250px
  height: 50px;
  line-height: 45px;
  font-size: 1.2em;
`

const Small = Default.extend`
  width: 120px;
  height: 35px;
  line-height: 30px;
  font-size: 0.75em;
`

const TextArea = {
  default: Default,
  medium: Medium,
  small: Small
}

export default TextArea;
