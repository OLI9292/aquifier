import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';

import Button from '../Common/button';
import { color } from '../../Library/Styles/index';

import explorePng from '../../Library/Images/explore-white.png';
import readPng from '../../Library/Images/read-white.png';
import studyPng from '../../Library/Images/study-white.png';
import singlePlayerPng from '../../Library/Images/singleplayer.png';
import setupMatchPng from '../../Library/Images/setupmatch.png';

class GameSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null
    };
  }

  handleClick(game, multiplayer = false) {
    this.setState({ redirect: `/play/game=${game}&multiplayer=${multiplayer}&setup=true` });
  }

  render() {
    if (this.state.redirect && !window.location.href.endsWith(this.state.redirect)) {
      return <Redirect push to={this.state.redirect} />;
    }

    const buttons = () => {
      return <div>
        <Button.small onClick={() => this.handleClick(this.state.hovering)}
          color={'white'} style={{display:'block',color:'black',margin:'0 auto',fontSize:'1.25em'}}>
          {Button.imageAndText(singlePlayerPng, 'Single Player')}
        </Button.small>
        <Button.small onClick={() => this.handleClick(this.state.hovering, true)}
          color={'white'} style={{display:'block',color:'black',margin:'0 auto',marginTop:'10px',fontSize:'1.25em'}}>
          {Button.imageAndText(setupMatchPng, 'Setup Match')}
        </Button.small>
      </div>
    }

    return (
      <div style={{paddingTop:'25px'}}>
        <Title>Choose Your Game</Title>
        <div style={{textAlign:'center'}}>

          <GameButton color={color.blue} onMouseOver={() => this.setState({ hovering: 'study' })} onMouseLeave={() => this.setState({ hovering: null })}>
            <Image src={studyPng} />
            <p style={{color:'white',fontSize:'2em',height:'10px',lineHeight:'10px'}}>Study</p>
            <div style={{width:'250px',height:'150px'}}>
              {
                this.state.hovering === 'study'
                  ? buttons()
                  : <p style={{color:'white',width:'90%',margin:'0 auto',fontSize:'1.25em'}}>
                      Thousands of words grouped by curriculum.
                    </p>          
              }
            </div>
          </GameButton>

          <GameButton color={color.green} onMouseOver={() => this.setState({ hovering: 'explore' })} onMouseLeave={() => this.setState({ hovering: null })}>
            <Image src={explorePng} />
            <p style={{color:'white',fontSize:'2em',height:'10px',lineHeight:'10px'}}>Explore</p>    
            <div style={{width:'250px',height:'150px'}}>    
              {
                this.state.hovering === 'explore'
                  ? buttons()
                  : <p style={{color:'white',width:'90%',margin:'0 auto',fontSize:'1.25em'}}>
                      The core vocabulary of dozens of subjects.
                    </p>
              }   
            </div>         
          </GameButton>

          <GameButton color={color.red} onMouseOver={() => this.setState({ hovering: 'read' })} onMouseLeave={() => this.setState({ hovering: null })}>
            <Image src={readPng} />
            <p style={{color:'white',fontSize:'2em',height:'10px',lineHeight:'10px'}}>Read</p>  
            <div style={{width:'250px',height:'150px'}}>      
              {
                this.state.hovering === 'read'
                  ? buttons()
                  : <p style={{color:'white',width:'90%',margin:'0 auto',fontSize:'1.25em'}}>
                      Passages with vocabulary in context.
                    </p>
              }    
            </div>                    
          </GameButton>

        </div>
      </div>
    );
  }
}

const Title = styled.div`
  background-color: ${color.orange};
  width: 450px;
  margin: 0 auto;
  height: 90px;
  line-height: 90px;
  margin-bottom: 25px;
  border-radius: 5px;
  text-align: center;
  font-size: 2.75em;
  color: white;
`

const Image = styled.img`
  height: 75px;
  width: 75px;
  padding-top: 20px;
`

const GameButton = styled.div`
  background-color: ${props => props.color};
  text-align: center;
  display: inline-block;
  margin: 10px;
  border-radius: 5px;
  vertical-align: top;
`

export default GameSelect;
