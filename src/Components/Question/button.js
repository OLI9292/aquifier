import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';

import Buttons from '../Buttons/default';
import { color } from '../../Library/Styles/index';
import { toUnderscore } from '../../Library/helpers';

class ButtonQuestion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      correct: true,
      choices: [],
      components: []
    }
  }

  componentDidMount() {
    this.reset(this.props.word);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.word.value !== this.props.word.value) {
      this.reset(nextProps.word);
    }
  }

  reset(word) {
    const components = word.components.map((c) => ({ value: c.value, display: c.type !== 'root' }) );
    const choices = this.choicesFor(word);
    this.setState({ components: components, correct: true, choices: choices });
  }

  checkComplete() {
    if (_.contains(_.pluck(this.state.components, 'display'), false)) { return };
    if (this.state.correct) {
      this.props.incrementScore();
    }
    this.props.nextQuestion();
  }

  choicesFor(word) {
    const correct = word.roots;
    const exclude = _.pluck(correct, 'value');
    const redHerrings = this.redHerrings(exclude);
    return _.shuffle(correct.concat(redHerrings));
  }

  guessed(choice) {
    const updatedComponents = this.state.components.map((c) => {
      return c.value === choice ? { value: c.value, display: true } : c;
    });

    const incorrect = _.isEqual(this.state.components, updatedComponents);

    incorrect
      ? this.setState({ correct: false })
      : this.setState({ components: updatedComponents }, this.checkComplete);
  }

  redHerrings(exclude) {
    const amount = 6 - exclude.length;
    return _.shuffle(this.props.roots.filter((r) => !_.contains(exclude, r.value))).slice(0, amount);
  }

  render() {
    const definition = () => {
      return this.props.word.definition.map((p, idx) => {
        return <span key={idx} style={{color: p.isRoot ? '#F5A50E' : 'black'}}>{p.value}</span>
      })
    }

    const answerSpaces = () => {
      return this.state.components.map((c, idx) => {
        return <AnswerSpace key={idx}>{c.display ? c.value.toUpperCase() : toUnderscore(c.value)}</AnswerSpace>
      })
    }

    const buttons = () => {
      return this.state.choices.map((c) => {
        return <GameButton
          key={c.value}
          onClick={() => {this.guessed(c.value)}}>{c.value.toUpperCase()}<br />{c.definition}</GameButton>
      })
    }

    return (
      <Layout>
        <Definition>{definition()}</Definition>
        <AnswerSpaces>{answerSpaces()}</AnswerSpaces>
        <GameButtons display={!this.props.isDisplayingImage}>{buttons()}</GameButtons>
      </Layout>
    );
  }
}

const Layout = styled.div`
`

const Definition = styled.div`
  font-size: 2.5em;
  margin: auto;
  margin-bottom: 2em;
  width: 75%
`

const AnswerSpaces = styled.div`
`

const AnswerSpace = styled.p`
  margin: 0% 1% 0% 1%;
  font-size: 2.5em;
  display: inline-block;
`

const GameButtons = styled.div`
  margin-top: 2em;
  display: ${props => props.display ? 'flex' : 'none'};
  flex-wrap: wrap;
  justify-content: center;
`

const GameButton = Buttons.large.extend`
  background-color: ${props => props.correct ? 'red' : 'green'};
  &:hover {
    background-color: ${color.blue10l};
  }
  margin: 10px;
  width: 250px;
  font-size: 2em;
`

export default ButtonQuestion;
