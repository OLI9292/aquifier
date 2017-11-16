import styled from 'styled-components';

const Default = styled.textarea`
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

const Medium = Default.extend`
  width: ${props => props.long 
    ? '500px'
    : props.short ? '125px' : '250px'};
  height: 55px;
  line-height: 50px;
  font-size: 1.2em;

  @media (max-width: 768px) {
    width: 200px;
    font-size: 1em;
  }
`

const Small = Default.extend`
  width: 120px;
  height: 35px;
  line-height: 30px;
  font-size: 0.75em;
`

const ExtraLarge = Default.extend`
  width: 400px;
  height: 100px;
  line-height: 90px;
  font-size: 2.25em;

  @media (max-width: 768px) {
    width: 300px;
    height: 80px;
    line-height: 70px;
    font-size: 2em;
  }
`

const TextArea = {
  default: Default,
  extraLarge: ExtraLarge,
  medium: Medium,
  small: Small
}

export default TextArea;
