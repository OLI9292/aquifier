import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  margin: auto;
  margin-top: 40px;
  padding-top: 15px;
  border-radius: 10px;
  height: 750px;
  background-color: white;
  @media (max-width: 1100px) {
    height: fit-content;
    margin-top: 15px;
  }
  @media (max-width: 450px) {
    margin-top: 10px;
    height: fit-content;
  }
`

export default Container;
