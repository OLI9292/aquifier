import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { color, media } from '../../Library/Styles/index';
import zipIcon from '../../Library/Images/blue-zip.png';

class Welcome extends Component {
  render() {
    return (
      <Container>
        <p style={{fontSize:'2.75em',color:color.yellow}}>
          WORDCRAFT
        </p>

        <p style={{fontSize:'1.75em',marginTop:'-20px'}}>
          Your free Wordcraft membership has begun!
        </p>

        <br />

        <p style={{fontSize:'1.25em',width:'60%',margin:'0 auto'}}>
          Print and keep the attached materials.
          <br />
          <br />
          Email us if you have any questions or need help. Have fun!
        </p>        

        <a href="my-program.zip" download>
          <img
            style={{height:'45px',width:'45px',cursor:'pointer',margin:'0 auto'}}
            src={zipIcon} />
        </a>
      </Container>
    );
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: white;
  border-radius: 20px;
  min-height: 70vh;
  text-align: center;
  padding-bottom: 20px;
  ${media.phone`
    font-size: 0.9em;
    min-height: 90vh;
  `};    
`

export default Welcome
