import React, { Component } from 'react';
import styled from 'styled-components';

import { color } from '../../Library/Styles/index';

class ProgressBar extends Component {
  marginLeft(checkpoint) {
    switch(checkpoint) {
      case 0: return this.props.checkpoints[0];
      case 1: return this.props.checkpoints[1] - this.props.checkpoints[0];
      case 2: return this.props.checkpoints[2] - this.props.checkpoints[1]
      default: break
    }
  }

  render() {
    const colors = [color.blue, color.green, color.red];

    const progress = `${this.props.progress * 100}%`;
    
    const checkpoints = (this.props.checkpoints || []).map((s,i) => {
      const last = i === 2;
      const marginLeft = last ? 0 : this.marginLeft(i) * this.container.offsetWidth;
      return <Mast key={i} marginLeft={`${marginLeft}px`} float={last}>
        <Flag color={colors[i]} />
      </Mast>
    })

    return (
      <Container ref={container => {this.container = container}}>
        {checkpoints}        
        <BackgroundBar />
        <Progress progress={progress} />
      </Container>
    );
  }
}

const Container = styled.div`
  width: 60%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
`

const Progress = styled.div`
  width: ${props => props.progress};
  height: 13px;
  margin-top: -13px;
  background-color: ${color.warmYellow};
  border-radius: 8px;
  z-index: 1000;
  transition: 0.2s;
  position: relative;
`

const BackgroundBar = styled.div`
  width: 60%;
  height: 9px;
  margin-top: -4px;
  z-index: 5;
  background-color: ${color.lightGray};
  border-radius: 5px;
  position: absolute
`

const Mast = styled.div`
  float: ${props => props.float ? 'right' : ''};
  margin-left: ${props => props.marginLeft};
  background-color: ${color.lightGray};
  height: 30px;
  width: 5px;
  z-index: 1;
  display: inline-block;
  position: relative;
`

const Flag = styled.div`
  background-color: ${props => props.color};
  width: 12px;
  height: 12px;
  margin-left: -7px;
`

export default ProgressBar;
