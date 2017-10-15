import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';

import Buttons from '../Buttons/default';
import { color } from '../../Library/Styles/index';
import { toUnderscore, sleep } from '../../Library/helpers';

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
    const components = word.components.map((c) => ({ value: c.value, display: c.componentType !== 'root' }) );
    const choices = this.choicesFor(word);
    this.setState({ components: components, correct: true, choices: choices });    
  }

  checkComplete() {
    if (_.contains(_.pluck(this.state.components, 'display'), false)) { return };
    this.props.record(this.state.correct);
    this.props.nextQuestion();
  }

  choicesFor(word) {
    const correct = this.props.roots.filter((r) => _.includes(word.roots, r._id));
    const exclude = _.pluck(correct, 'value');
    const redHerrings = this.redHerrings(exclude);
    let choices = _.shuffle(correct.concat(redHerrings));
    choices.forEach((c) => c.correct = null);
    return choices;
  }

  guessed(choice) {
    const updatedComponents = this.state.components.map((c) => {
      return c.value === choice ? { value: c.value, display: true } : c;
    });
    
    const correct = !_.isEqual(this.state.components, updatedComponents);
    this.animate(choice, correct);

    correct
      ? this.setState({ components: updatedComponents }, this.checkComplete)
      : this.setState({ correct: false });
  }

  animate = async (choice, correct) => {
    let copy = this.state.choices;
    copy.forEach((c) => { if (c.value === choice) { c.correct = correct } });
    this.setState({ choices: copy });
    if (!correct) {
      await sleep(200);
      copy.forEach((c) => { if (c.value === choice) { c.correct = null } });
      this.setState({ choices: copy });
    }
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
          correct={c.correct}
          key={c.value}
          onClick={() => {this.guessed(c.value)}}>{c.value.toUpperCase()}
          <br />
          <SmallText>
            {_.find(c.definitions, (d) => _.contains(_.pluck(this.props.word.components, 'definition'), d)) || c.definitions[0]}
          </SmallText>
        </GameButton>
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
  font-size: 2em;
  margin: auto;
  margin-bottom: 1em;
  width: 75%;
  @media (max-width: 768px) {
    font-size: 1.75em;
  }
`

const AnswerSpaces = styled.div`
`

const AnswerSpace = styled.p`
  margin: 0% 1% 0% 1%;
  font-size: 2.5em;
  display: inline-block;
`

const GameButtons = styled.div`
  margin-top: 3em;
  display: ${props => props.display ? 'flex' : 'none'};
  flex-wrap: wrap;
  justify-content: center;
`

const GameButton = Buttons.large.extend`
  background-color: ${props => props.correct === true
    ? color.green
    : props.correct === false ? color.red : color.blue};
  &:hover {
    background-color: ${props => props.correct === true
      ? color.green
      : props.correct === false ? color.red : color.blue10l};
  }
  transition-duration: 0.2s;
  margin: 10px;
  width: 250px;
  font-size: 2.2em;
  @media (max-width: 1000px) {
    font-size: 1.8em;
  }
`

const SmallText = styled.span`
  font-size: 0.7em;
  opacity: 0.95;
`
export default ButtonQuestion;
