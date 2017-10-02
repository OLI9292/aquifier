import styled from 'styled-components';

const DefaultTextArea = styled.textarea`
  background-color: #f1f1f1;
  border: none;
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

const MediumTextArea = DefaultTextArea.extend`
  width: 250px;
  height: 50px;
  font-size: 1.25em;
  padding-top: 15px;

  @media (max-width: 768px) {
    width: 200px;
    height: 40px;
    line-height: 40px;
    font-size: 1em;
  }
`

const TextAreas = {
  medium: MediumTextArea
}

export default TextAreas;
