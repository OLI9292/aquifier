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
      guess: ''
    }
  }

  componentDidMount() {
    this.reset(this.props.word);

    document.body.addEventListener('keydown', (event) => {
      this.handleInput(event);
    });
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
    if (answerComplete) {
      this.setState({ answerComplete: true });
    } else {
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
    let components;
    let answer;
    let cursorEndpoints;

    if (this.props.level === 'Intermediate') {
      const randomRoot = _.shuffle(word.roots)[Math.floor(Math.random() * (word.roots.length - 1))];
      answer = randomRoot.value;
      components = _.flatten(word.components.map((c) => {
        const display = c.value != randomRoot.value;
        return c.value.split('').map((char) => ({ value: char, guess: display ? char : null }))
      }));
      cursorEndpoints = [_.findIndex(components, (c) => !c.guess), _.findLastIndex(components, (c) => !c.guess)];
    } else { // Advanced
      answer = word.components.map((c) => c.value).join('');
      components = word.value.split('').map((char) => ({ value: char, guess: null }));
      cursorEndpoints = [0, answer.length - 1];
    }

    this.setState({ answer: answer, components: components, cursor: cursorEndpoints[0], cursorEndpoints: cursorEndpoints });
  }

  tappedHint() {
    let copy = this.state.components;
    const inCorrectIdx = _.findIndex(copy, this.isIncorrect);
    copy[inCorrectIdx].guess = copy[inCorrectIdx].value;
    this.setState({ components: copy });
  }

  render() {
    const definition = () => {
      console.log(this.props.word.definition);
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
        <HintButton onClick={() => this.tappedHint()}>Hint</HintButton>
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
