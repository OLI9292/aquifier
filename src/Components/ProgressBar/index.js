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

    const width = `${this.props.width * 100}%`;
    
    const checkpoints = this.props.checkpoints.map((s,i) => {
      const last = i === 2;
      const marginLeft = last ? 0 : this.marginLeft(i) * this.container.offsetWidth;
      return <Mast key={i} marginLeft={`${marginLeft}px`} float={last}>
        <Flag color={colors[i]} />
      </Mast>
    })

    return (
      <div ref={container => {this.container = container}}>
        {checkpoints}        
        <BackgroundBar />
        <Progress width={width} />
      </div>
    );
  }
}

const Progress = styled.div`
  width: ${props => props.width};
  height: 13px;
  margin-top: -13px;
  background-color: ${color.blue};
  border-radius: 8px;
  z-index: 1000;
  position: relative;
`

const BackgroundBar = styled.div`
  width: 100%;
  height: 9px;
  margin-top: -11px;
  z-index: 5;
  background-color: ${color.lightGray};
  border-radius: 5px;
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
