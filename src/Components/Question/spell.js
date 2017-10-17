import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';

import Buttons from '../Buttons/default';
import { color } from '../../Library/Styles/index';
import { isLetter, sleep, toUnderscore } from '../../Library/helpers';

class SpellQuestion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      answer: '',
      answerComplete: false,
      definition: this.props.word.definition,
      correct: true,
      choices: [],
      components: [],
      cursorEndpoints: [0,0],
      cursor: 0,
      displayRootDefs: false,
      displayErrors: false,
      hintDisabled: false,
      rootsInDefinitionsShown: false,
      guess: '',
      word: null
    }
  }

  componentDidMount() {
    this.reset(this.props.word);
    document.body.addEventListener('keydown', this.handleInput.bind(this), true);
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.handleInput, true);
  }

  componentWillReceiveProps(nextProps) {
    if (_.isEqual(this.props.word, nextProps.word)) { return };
    this.reset(nextProps.word);
  }

  handleInput(e) {
    if (this.state.answerComplete) {
      return;
    }

    const pressedEnter = e.key === 'Enter';
    const pressedLetter = isLetter(e.key);
    const pressedLeft = e.keyCode === 37;
    const pressedRight = e.keyCode === 39;
    const pressedDelete = e.keyCode === 8;

    if (pressedEnter) {
      e.preventDefault();
      this.checkAnswer(true);
    } else if (pressedLetter) {
      this.handleLetterPress(e.key)
    } else if (pressedLeft || pressedRight) {
      this.handleArrowPress(pressedLeft);
    } if (pressedDelete) {
      this.handleDeletePress();
    }
  }

  checkAnswer(pressedEnter = false) {
    // don't check until the whole word is spelled, unless the user presses enter
    if (!pressedEnter && _.contains(_.pluck(this.state.components, 'guess'), null)) {
      return;
    }
    this.setState({ displayErrors: true }, this.checkIfComplete);
  }

  checkIfComplete = async () => {
    await sleep(1000);
    const answerComplete = _.isEmpty(this.state.components.filter(this.isIncorrect));
    if (answerComplete && !this.state.answerComplete) {
      this.setState({ answerComplete: true, cursor: -1 }, () => this.props.nextQuestion());
<<<<<<< HEAD
      this.props.incrementScore(1);
=======
      this.props.record(true);
>>>>>>> master
    }
  }

  isIncorrect(component) {
    return _.isNull(component.guess) || component.value !== component.guess;
  }

  handleArrowPress(pressedLeft) {
    if (pressedLeft) {
      if (this.state.cursor > this.state.cursorEndpoints[0]) {
        this.setState({ cursor: this.state.cursor - 1 });
      }
    } else if (this.state.cursor < this.state.cursorEndpoints[1]) {
      this.setState({ cursor: this.state.cursor + 1 });
    }
  }

  handleDeletePress() {
    let copy = this.state.components;
    copy[Math.max(this.state.cursor - 1, 0)].guess = null;
    this.handleArrowPress(true);
    this.setState({ components: copy });
  }

  handleLetterPress(letter) {
    let copy = this.state.components;
    copy[this.state.cursor].guess = letter;
    const cursor = this.state.cursor === this.state.cursorEndpoints[1] ? this.state.cursor : this.state.cursor + 1;
    this.setState({ components: copy, cursor: cursor }, this.checkAnswer);
  }

  reset(word) {
    const params = this.props.level === 'Intermediate'
      ? this.intermediateParams(word)
      : this.advancedParams(word);

    this.setState({
      answer: params.answer,
      answerComplete: false,
      components: params.components,
      cursor: params.cursorEndpoints[0],
      cursorEndpoints: params.cursorEndpoints,
      definition: word.definition,
      displayErrors: false,
      rootsInDefinitionsShown: false,
      word: word
    });
  }

  intermediateParams(word) {
    const randomRoot = _.shuffle(word.roots)[Math.floor(Math.random() * (word.roots.length - 1))];
    const answer = _.find(this.props.roots, (r) => r._id === randomRoot).value;
    const components = _.flatten(word.components.map((c) => {
      const display = c.value !== answer;
      return c.value.split('').map((char) => ({ value: char, guess: display ? char : null }))
    }));
    const cursorEndpoints = [_.findIndex(components, (c) => !c.guess), _.findLastIndex(components, (c) => !c.guess)];
    return { answer: answer, components: components, cursorEndpoints: cursorEndpoints };
  }

  advancedParams(word) {
    const answer = word.components.map((c) => c.value).join('');
    const components = word.value.split('').map((char) => ({ value: char, guess: null }));
    const cursorEndpoints = [0, answer.length - 1];
    return { answer: answer, components: components, cursorEndpoints: cursorEndpoints };
  }

  pressedHint = async () => {
    if (this.state.hintDisabled) {
      return;
    }
    !this.state.rootsInDefinitionsShown ? this.revealRootsinDefinition() : this.giveAwayLetter();
    this.toggleHintDisabled();
    await sleep(1000);
    this.toggleHintDisabled();
  }

  toggleHintDisabled() {
    this.setState({ hintDisabled: !this.state.hintDisabled });
  }

  giveAwayLetter() {
    let copy = this.state.components;
    const incorrectIdx = _.findIndex(copy, this.isIncorrect);
    if (incorrectIdx >= 0) {
      copy[incorrectIdx].guess = copy[incorrectIdx].value;
      let cursor = Math.min(incorrectIdx + 1, this.state.cursorEndpoints[1]);
      this.setState({ components: copy, cursor: cursor });
    } else {
      this.checkAnswer();
    }
  }

  revealRootsinDefinition() {
    const updated = this.state.definition.map((part) => {
      const rootComponent = _.find(this.state.word.components, (c) => c.definition === part.value);
      return part.isRoot && rootComponent
        ? { isRoot: true, value: `${part.value} (${rootComponent.value.toUpperCase()})` }
        : part
    });
    this.setState({ definition: updated, rootsInDefinitionsShown: true });
  }

  render() {
    const definition = () => {
      return this.state.definition.map((p, idx) => {
        return <span key={idx} style={{color: p.isRoot ? '#F5A50E' : 'black'}}>{p.value}</span>
      })
    }

    const answerSpaces = () => {
      return this.state.components.map((c, idx) => {
        const correct = c.guess && c.value === c.guess;
        return <AnswerSpace
          correct={correct}
          displayErrors={c.guess && this.state.displayErrors}
          cursorOn={this.state.cursor === idx}
          key={idx}>{c.guess ? c.guess.toUpperCase() : toUnderscore(c.value)}
        </AnswerSpace>
      })
    }

    return (
      <Layout>
        <Definition>{definition()}</Definition>
        <div>{answerSpaces()}</div>
        <HintButton display={!this.props.isDisplayingImage} type='button' onClick={() => this.pressedHint()}>Hint</HintButton>
      </Layout>
    );
  }
}

const Layout = styled.div`
`

const AnswerSpace = styled.p`
  color: ${
    props => props.cursorOn
      ? color.blue
      : props.displayErrors
        ? props.correct ? color.green : color.red
        : color.black
  };
  display: inline-block;
  font-size: 2.5em;
  margin: 0% 1% 0% 1%;
`

const Definition = styled.div`
  font-size: 2.5em;
  margin: auto;
  margin-bottom: 1em;
  width: 75%
`

const HintButton = Buttons.medium.extend`
  margin-top: 50px;
  display: ${props => props.display ? 'normal' : 'none'};
  background-color: ${color.blue};
  &:hover {
    background-color: ${color.blue10l};
  }
`

export default SpellQuestion;
