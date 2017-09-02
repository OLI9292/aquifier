import styled from 'styled-components';

const DefaultTextArea = styled.textarea`
  background-color: #f1f1f1;
  border: none;
  border-radius: 5px;
  font-family: BrandonGrotesque;
  &:focus {
    outline: 0;
  }
  padding: 10px;
  resize: none;
  transition: 0.2s;
`

const MediumTextArea = DefaultTextArea.extend`
  width: 350px;
  height: 70px;
  line-height: 70px;
  font-size: 2em;
`

const TextAreas = {
  medium: MediumTextArea
}

export default TextAreas;
