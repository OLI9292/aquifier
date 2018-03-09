import React from 'react';
import styled, { keyframes } from 'styled-components';

const image = require('../../Library/Images/circle-load.png');

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const LoadingSpinner = styled.img`
  height: 80px;  
  width: auto;
  animation: ${rotate360} 2s linear infinite;
`

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
`

export default () => {
  return <Container>
    <LoadingSpinner src={image} />
  </Container>
}
