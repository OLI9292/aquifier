import { Redirect } from 'react-router';
import queryString from 'query-string';
import React, { Component } from 'react';
import _ from 'underscore';

import { shouldRedirect } from '../../../Library/helpers'

import { DESCRIPTIONS } from './categories';

import {
  BackArrow,
  LevelSelectContainer,
  LevelSelectHeader,
  SubcategoryDescription,
  LevelButton,
  LevelButtonText,
  LevelButtonsContainer
} from './components';

class Explore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      difficulty: 1
    };
  }

  play(level) {
    const params = { type: 'explore', id: level._id, questionLevel: this.state.difficulty };
    this.setState({ redirect: '/play/' + queryString.stringify(params) });
  }  

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }

    const subcategory = this.props.subcategory;

    const button = level => {
      return <LevelButton onClick={() => this.play(level)} color={subcategory.color} key={level.ladder}>
        <LevelButtonText>
          {level.ladder}
        </LevelButtonText>
      </LevelButton>
    }

    const difficultySelect = (() => {
      return <div style={{marginTop:'50px'}}>
        <p>
          Difficulty Select <span style={{color:'#828282'}}>(for testing)</span>
        </p>
        <select value={this.state.difficulty} onChange={e => this.setState({ difficulty: e.target.value })}>
          {_.map(_.range(1, 11), diff => <option key={diff} value={diff}>{diff}</option>)}
        </select>
      </div>
    })();

    return (
      <LevelSelectContainer>
        <BackArrow
          onClick={() => this.props.clickedBack()}
          src={require('../../../Library/Images/icon-back-arrow.png')} />
        <LevelSelectHeader color={subcategory.color}>
          {subcategory.name.toUpperCase()}
        </LevelSelectHeader>
        {
          _.has(DESCRIPTIONS, subcategory.name) && 
          <SubcategoryDescription>
            {DESCRIPTIONS[subcategory.name]}
          </SubcategoryDescription>
        }
        <LevelButtonsContainer>
          {_.map(_.sortBy(subcategory.levels, 'ladder'), button)}
        </LevelButtonsContainer>
        {difficultySelect}
      </LevelSelectContainer>
    );
  }
}

export default Explore
