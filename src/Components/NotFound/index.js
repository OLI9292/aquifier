import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { color, media } from '../../Library/Styles/index';

class Leaderboards extends Component {
  render() {
    return (
      <Container>
        <InnerContainer>
          <img
            alt={'monk meditating'}
            src={require('../../Library/Images/astral.gif')}
            style={{height:'100%',width:'auto'}} />
          <div style={{textAlign:'left',marginLeft:'50px'}}>
            <p style={{fontSize:'2em',margin:'0'}}>
              Error <b>404</b>
            </p>            
            <p style={{fontSize:'1.1em',color:color.gray2,padding:'10px 0px',margin:'0'}}>
              Sorry this page does not exist. Try visiting <Link
                style={{textDecoration:'none',color:color.mainBlue}}
                to='/'>playwordcraft.com.</Link>
            </p>
            <p style={{fontSize:'1.1em',color:color.yellow,fontFamily:'BrandonGrotesqueBold',margin:'0'}}>
              WORDCRAFT
            </p>
          </div>
        </InnerContainer>
      </Container>
    );
  }
}

const InnerContainer = styled.div`
  height: 200px;
  width: 500px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  ${media.phone`
    width: 90%;
    margin: 0 auto;
  `};    
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

export default Leaderboards
