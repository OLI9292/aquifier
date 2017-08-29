import React, { Component } from 'react';
import styled from 'styled-components';

const DefaultButton = styled.button`
  &:focus {
    outline: 0;
  }
  border-radius: 10px;
  border-width: 0px;
  color: white;
  cursor: pointer;
  font-family: BrandonGrotesque;
  transition: 0.2s;
`

export default DefaultButton;
