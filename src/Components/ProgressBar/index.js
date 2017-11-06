import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';

import { color } from '../../Library/Styles/index';

class ProgressBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const width = `${this.props.width * 100}%`;
    return (
      <Container>
        <BackgroundBar />
        <Progress width={width} />
      </Container>
    );
  }
}

const Container = styled.div`
`

const Progress = styled.div`
  width: ${props => props.width};
  height: 15px;
  margin-top: -15px;
  z-index: 100;
  background-color: ${color.blue};
  border-radius: 8px;
`

const BackgroundBar = styled.div`
  width: 100%;
  height: 9px;
  z-index: 5;
  background-color: ${color.lightGray};
  border-radius: 5px;
`

export default ProgressBar;
