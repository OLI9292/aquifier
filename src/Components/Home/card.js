import _ from 'underscore';
import React, { Component } from 'react';
import styled from 'styled-components';

import { color } from '../../Library/Styles/index';

const TYPES = {
  howItWorks: {
    header: 'HOW IT WORKS',
    description: 'Solve fast-paced puzzles to decipher the most sophisticated vocabulary in English.',
    highlight: ['sophisticated', 'vocabulary'],
    icon: require('../../Library/Images/Home/icon-info.png'),
    image: require('../../Library/Images/Home/how-it-works-game.png')
  },
  multiplayer: {
    header: 'MULTIPLAYER',
    description: 'Play multiplayer vocabulary games in class. Register your school for international competition.',
    highlight: ['multiplayer', 'international', 'competition'],
    icon: require('../../Library/Images/Home/icon-users.png'),
    image: require('../../Library/Images/Home/multi.png')
  },
  progressReport: {
    header: 'PROGRESS REPORT',
    description: 'Individualized progress reports allow teachers, students, and parents to track achievements.',
    highlight: ['progress', 'reports'],
    icon: require('../../Library/Images/Home/icon-progress.png'),
    image: require('../../Library/Images/Home/progress.png')
  },
  readingComprehension: {
    header: 'READING COMPREHENSION',
    description: 'Improve reading comprehension with thousands of passages from classical and modern texts.',
    highlight: ['reading', 'comprehension'],
    icon: require('../../Library/Images/Home/icon-book.png'),
    image: require('../../Library/Images/Home/reading.png')
  }  
}

const highlight = (text, toHighlight) => {
  return text
    .split(' ')
    .map(w => <span style={{color:_.contains(toHighlight, w) ? color.mainBlue : 'black'}}>{w} </span>)
}

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  invertedCheck() {
    return this.props.inverted && !this.props.smallScreen;
  }

  render() {
    const data = TYPES[this.props.type];
    const inverted = this.invertedCheck();

    const info = (() => {
      const [justify, textAlign] = inverted ? ['',''] : ['flex-end', 'right'];

      const header = (() => {
        return <h3 style={{fontFamily:'BrandonGrotesqueBold',color:color.gray2,fontSize:'1.25em'}}>
          {data.header}
        </h3>
      })();

      const icon = (() => <img alt={data.header} src={data.icon} style={{height:'100%',width:'auto'}} />)();

      return <Info textAlign={textAlign}>
        <Header justify={justify}>
          {inverted ? icon : header}
          <div style={{height:'100%',width:'15px'}}/>
          {inverted ? header : icon}
        </Header>
        <br />
        <Description>
          {highlight(data.description, data.highlight)}
        </Description>          
      </Info>
    })();

    const screenshot = (() => {
      const float = this.props.inverted ? 'right' : 'left';
      return <Screenshot>
        <Image
          float={float}
          src={data.image} />
      </Screenshot>
    })();

    return (
      <OuterContainer gray={this.props.inverted}>  
        <InnerContainer>
        {inverted ? screenshot : info}
        <div style={{height:'100%',width:'15%'}}/>
        {inverted ? info : screenshot}
        </InnerContainer>
      </OuterContainer>
    );
  }
}

const OuterContainer = styled.div`
  width: 100%;
  background-color: ${props => props.gray ? 'white' : color.lightestGray};
  @media (min-width: 900px) {
    height: 500px;
  }  
`

const InnerContainer = styled.div`
  width: 80%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  @media (max-width: 900px) {
    display: block;
    padding-top: 75px;
    padding-bottom: 75px;
  } 
`

const Header = styled.div`
  display: flex;
  height: 50px;
  justify-content: ${props => props.justify};
  align-items: center;
  font-size: 1.5em;
  @media (max-width: 900px) {
    justify-content: center;
    text-align: center;
  }    
`

const Description = styled.p`
  font-size: 1.5em;
  @media (max-width: 900px) {
    text-align: center;
  }   
`

const Screenshot = styled.div`
  width: 42.5%;
  height: 100%;
  @media (max-width: 900px) {
    margin-top: 50px;
    height: 400px;
    width: 100%;
    text-align: center;
  }  
`

const Image = styled.img`
  height: 80%;
  width: auto;
  float:${props => props.float};
  margin-top: 10%;
  @media (max-width: 900px) {
    height: 100%;
    margin-top: 0%;
    width: auto;
    float: none;
  }    
`

const Info = styled.div`
  width: 42.5%;
  text-align: ${props => props.textAlign};
  @media (max-width: 900px) {
    width: 80%;
    margin: 0 auto;
  }    
`

export default Card;
