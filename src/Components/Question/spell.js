import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';

import Buttons from '../Buttons/default';
import TextAreas from '../TextAreas/index';
import { color } from '../../Library/Styles/index';
import { isLetter, sleep, toUnderscore } from '../../Library/helpers';

class SpellQuestion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      answer: '',
      answerComplete: false,
      correct: true,
      choices: [],
      components: [],
      cursorEndpoints: [0,0],
      cursor: 0,
      displayRootDefs: false,
      displayErrors: false,
      guess: '',
      word: null
    }
  }

  componentDidMount() {
    this.reset(this.props.word);
    // TODO: - remove on unmount
    document.body.addEventListener('keydown', (event) => {
      this.handleInput(event);
    });
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
    this.setState({ displayErrors: true }, this.disableDisplayErrors);
  }

  disableDisplayErrors = async () => {
    await sleep(1000);
    const answerComplete = _.isEmpty(this.state.components.filter(this.isIncorrect));
    if (answerComplete && !this.state.answerComplete) {
      this.setState({ answerComplete: true }, () => this.props.nextQuestion());
    } else {
      console.log("turn off")
      this.setState({ displayErrors: false });
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
    copy[this.state.cursor].guess = null;
    this.setState({ components: copy });
  }

  handleLetterPress(letter) {
    let copy = this.state.components;
    copy[this.state.cursor].guess = letter;
    const cursor = this.state.cursor === this.state.answer.length - 1 ? this.state.cursor : this.state.cursor + 1;
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
      displayErrors: false,
      word: word
    });
  }

  intermediateParams(word) {
    const randomRoot = _.shuffle(word.roots)[Math.floor(Math.random() * (word.roots.length - 1))];
    const answer = randomRoot.value;
    const components = _.flatten(word.components.map((c) => {
      const display = c.value != randomRoot.value;
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

  tappedHint() {
    let copy = this.state.components;
    const inCorrectIdx = _.findIndex(copy, this.isIncorrect);
    if (inCorrectIdx >= 0) {
      copy[inCorrectIdx].guess = copy[inCorrectIdx].value;
      this.setState({ components: copy });      
    } else {
      this.checkAnswer();
    }
  }

  render() {
    const definition = () => {
      return this.props.word.definition.map((p, idx) => {
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
        <HintButton type="button" onClick={() => this.tappedHint()}>Hint</HintButton>
      </Layout>
    );
  }
}

const Layout = styled.div`
`

const AnswerSpace = styled.p`  
  color: ${
    props => props.displayErrors
      ? props.correct ? color.green : color.red
      : props.cursorOn ? color.blue : color.black
  };
  display: inline-block;
  font-size: 2.5em;
  margin: 0% 1% 0% 1%;
`

const Definition = styled.div`
  font-size: 2.5em;
  margin: auto;
  margin-bottom: 2em;
  width: 75%
`

const HintButton = Buttons.medium.extend`
  background-color: ${color.blue};
  &:hover {
    background-color: ${color.blue10l};
  }
`

export default SpellQuestion;
