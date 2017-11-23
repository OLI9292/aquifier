import styled from 'styled-components';

const Heading = styled.h1`
  color: ${props => props.color};
  background-color: ${props => props.backgroundColor || 'transparent'};
  paddingTop: 25px;
  padding-left: 5%;
  font-size: 2.75em;
  letter-spacing: 2px;
  margin-bottom: 0px;
  line-height: 50px;
  padding-bottom: 10px;
  @media (max-width: 1100px) {
    font-size: 2em;
  }
  @media (max-width: 450px) {
    font-size: 1.25em;
  }
`

export default Heading;
