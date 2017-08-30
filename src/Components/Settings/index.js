import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';

import Buttons from '../Buttons/default';
import { color } from '../../Assets/Styles/index';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      timeIdx: 0,
      levelIdx: 0,
      topicIndices: [0],
      redirect: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.redirect = this.redirect.bind(this);
  }

  redirect() {
    this.setState({ redirect: true });
  }

  handleClick(group, idx) {
    switch (group) {
      case 'time':
        this.setState({ timeIdx: idx });
        break;
      case 'level':
        this.setState({ levelIdx: idx });
        break;
      case 'topic':
        const indices = _.contains(this.state.topicIndices, idx)
          ? this.state.topicIndices.filter((tIdx) => tIdx !== idx)
          : this.state.topicIndices.concat([idx])
        this.setState({ topicIndices: indices });
        break;
    }
  }

  render() {
    if (this.state.redirect) {
      const location = this.props.multiplayer ? '/game/admin' : '/game';
      return <Redirect push to={location} />;
    }

    const TIMES = ['3 Minutes', '5 Minutes'];
    const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
    const TOPICS = ['Everything', 'Math', 'Nature', 'History', 'Science'];

    const timeButtons = TIMES.map((t, idx) => {
      return <SelectionButton 
        onClick={() => this.handleClick('time', idx)} 
        selected={this.state.timeIdx === idx}
      >{t}</SelectionButton>
    });

    const levelButtons = LEVELS.map((l, idx) => {
      return <SelectionButton 
        onClick={() => this.handleClick('level', idx)} 
        selected={this.state.levelIdx === idx}
      >{l}</SelectionButton>
    });

    const topicButtons = TOPICS.map((t, idx) => {
      return <SelectionButton 
        onClick={() => this.handleClick('topic', idx)} 
        selected={_.contains(this.state.topicIndices, idx)}
      >{t}</SelectionButton>
    });

    return (
      <Layout>
        <Selection>
          <tr>
            <ShortCell><Text>Time</Text></ShortCell>
            <LongCell>{timeButtons}</LongCell>
          </tr>
          <tr>
            <ShortCell><Text>Level</Text></ShortCell>
            <LongCell>{levelButtons}</LongCell>
          </tr>
          <tr>
            <ShortCell><Text>Topic</Text></ShortCell>
            <LongCell>{topicButtons}</LongCell>
          </tr>
        </Selection>
        <ButtonContainer>
          <AccessCodeButton onClick={this.redirect}>
            {this.props.multiplayer ? 'Generate Access Code for Match' : 'Play'}
          </AccessCodeButton>
        </ButtonContainer>
      </Layout>
    );
  }
}

const Layout = styled.div`
  padding: 5% 0 5% 0;
`

const Selection = styled.div`
  margin-left: 20px;
`

const ShortCell = styled.td`
  vertical-align: top;
  width: 100px;
  padding-right: 2em;
`

const LongCell = styled.td`
  vertical-align: top;
  width: 100%;
  padding-bottom: 3em;
`

const Text = styled.h4`
  display: inline;
  font-size: 2em;
  margin-right: 10px;
`

const SelectionButton = Buttons.medium.extend`
  background-color: ${props => props.selected ? color.red : color.lightestGray};
  color: ${props => props.selected ? 'white' : 'black'};
  margin: 0 0.5em 0.5em 0;
`

const ButtonContainer = styled.div`
  width: 100%;
  text-align: center;
`

const AccessCodeButton = Buttons.extraLarge.extend`
  background-color: ${color.blue};
  &:hover {
    background-color: ${color.blue10l};
  }
  font-size: 2.5em;
  height: 125px;
`

export default Settings;
