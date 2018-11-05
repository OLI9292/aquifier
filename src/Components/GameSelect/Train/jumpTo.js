import React, { Component } from 'react';
import styled from 'styled-components';

import { media } from '../../../Library/Styles/index';

import {
  Img,
  LevelButton
} from './components';

class JumpTo extends Component {
  render() {
    const furthestLevel = this.props.furthestLevel;

    const levelButton = level => {
      return <div style={{margin:'30px 0px'}}>
        <LevelButton
          isLocked={false}
          bColor={'lightGray'}
          onClick={() => this.props.jumpTo(level._id)}>

          <Img 
            src={this.props.imgSrc}
            opaque={false} />
        </LevelButton>
        <p style={{lineHeight:'0px',color:'white'}}>
          {level.name.toUpperCase()}
        </p>
      </div>
    }

    return (
      <Container>
        <p style={{color:'white',margin:'-30px 25px 0px 25px'}}>
          JUMP TO
        </p>
        {furthestLevel && levelButton(furthestLevel)}
      </Container>
    );
  }
}

const Container = styled.div`
  width: 90%;
  margin: 0 auto;
  padding: 5px 0px;
  border-radius: 20px;
  max-width: 500px;
  margin-top: 10px;
  background: radial-gradient(at top,#65BCEE,#3F80E6);
  display: flex;
  align-items: center;
  padding: 0% 5%;
  justify-content: center;
  box-sizing: border-box;
  ${media.phone`
    margin-top: 0;
  `};   
`

export default JumpTo
