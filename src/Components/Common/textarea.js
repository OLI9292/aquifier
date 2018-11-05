import styled from 'styled-components';
import { color } from '../../Library/Styles/index';

const Default = styled.textarea`
  background-color: white;
  border: 2px solid ${color.lightGray};
  border-radius: 10px;
  font-family: BrandonGrotesque;
  &:focus {
    outline: 0;
  }
  resize: none;
  transition: 0.2s;
  box-sizing: border-box;
  padding: 20px;
  font-size: 1.05em;
  width: 100%;
`

const TextArea = {
  medium: Default
}

export default TextArea;
