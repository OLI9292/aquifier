import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';

import leftArrow from '../../Library/Images/left-arrow.png';
import rightArrow from '../../Library/Images/right-arrow.png';
import equalsKey from '../../Library/Images/equals.png';
import returnKey from '../../Library/Images/return.png';
import returnKeyGreen from '../../Library/Images/return-green.png';
import { color } from '../../Library/Styles/index';

class Directions extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const nextQparams = this.props.isInterlude
        ? { color: color.green, text: 'Next Question', image: returnKeyGreen }
        : { color: color.gray, text: 'Check Answer', image: returnKey };    

    const nextQuestionDirection = () => {
      return <div style={{height:'25px', marginBottom:'30px'}}>
        <h4 style={{textAlign:'left',color:nextQparams.color,height:'5px',fontSize:'0.85em'}}>
          {nextQparams.text}
        </h4>
        <img src={nextQparams.image} alt='enter-key' style={{height:'100%',width:'auto'}} />
      </div>;
    };

    return (
      <div style={{position:'absolute',bottom:'0',margin:'0px 0px 10px 10px'}}>
        <div style={{height:'25px', marginBottom:'30px'}}>
          <h4 style={{textAlign:'left',color:color.gray,height:'5px',fontSize:'0.85em'}}>
            Move
          </h4>
          <img src={leftArrow} alt='left-arrow' style={{height:'100%',width:'auto'}} />
          <img src={rightArrow} alt='right-arrow' style={{height:'100%',width:'auto'}} />
        </div>
        <div style={{height:'25px', marginBottom:'30px'}}>
          <h4 style={{textAlign:'left',color:color.gray,height:'5px',fontSize:'0.85em'}}>
            Hint
          </h4>
          <img src={equalsKey} alt='equals-key' style={{height:'100%',width:'auto'}} />
        </div>
        {nextQuestionDirection()}
      </div>
    );
  }
}

export default Directions;
