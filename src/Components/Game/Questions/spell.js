import { connect } from 'react-redux'
import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';

import Button from '../../Common/button';
import { color } from '../../../Library/Styles/index';
import { isLetter, sleep, toUnderscore } from '../../../Library/helpers';

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
      hintCount: 0,
      guess: '',
      word: null
    }

    this.handleInput = this.handleInput.bind(this);
  }

  componentDidMount() {
    this.reset(this.props.word);
    document.body.addEventListener('keydown', this.handleInput);
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.handleInput);
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
    const pressedEquals = e.keyCode === 187 || e.keyCode === 61;
    const pressedLetter = isLetter(e.key);
    const pressedLeft = e.keyCode === 37;
    const pressedRight = e.keyCode === 39;
    const pressedDelete = e.keyCode === 8;

    if (pressedEnter) {
      this.checkAnswer(true);
    } else if (pressedEquals) {
      this.pressedHint();
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
    const answerComplete = _.isEmpty(this.state.components.filter(this.isIncorrect));
    if (answerComplete && !this.state.answerComplete) {
      const correct = this.state.hintCount < 3;
      this.setState({
        answerComplete: true,
        cursor: -1
      },() => this.props.nextQuestion(correct));
    } else {
      this.props.incrementIncorrectGuesses();
    }
  }

  isIncorrect(component) {
    return _.isNull(component.guess) || component.value.toLowerCase() !== component.guess.toLowerCase();
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
    if (this.state.cursor > this.state.cursorEndpoints[0]) {
      let copy = this.state.components;
      copy[Math.max(this.state.cursor - 1, 0)].guess = null;
      this.handleArrowPress(true);
      this.setState({ components: copy });
    }
  }

  handleLetterPress(letter) {
    if (this.state.cursor !== this.state.cursorEndpoints[1] + 1) {
      let copy = this.state.components;
      copy[this.state.cursor].guess = letter;
      const cursor = this.state.cursor + 1;
      this.setState({ components: copy, cursor: cursor }, this.checkAnswer);
    }
  }

  reset(word) {
    const params = this.props.isEasy
      ? this.easyParams(word)
      : this.hardParams(word);

    this.setState({
      answer: params.answer,
      answerComplete: false,
      components: params.components,
      cursor: params.cursorEndpoints[0],
      cursorEndpoints: params.cursorEndpoints,
      definition: word.definition,
      displayErrors: false,
      hintCount: 0,
      word: word
    });
  }

  easyParams(word) {
    const randomRoot = _.shuffle(word.roots)[Math.floor(Math.random() * (word.roots.length - 1))];
    const answer = _.find(this.props.roots, (r) => r._id === randomRoot).value;
    const components = _.flatten(word.components.map((c) => {
      const display = c.value !== answer;
      return c.value.split('').map((char) => ({ value: char, guess: display ? char : null }))
    }));
    const cursorEndpoints = [_.findIndex(components, (c) => !c.guess), _.findLastIndex(components, (c) => !c.guess)];
    return { answer: answer, components: components, cursorEndpoints: cursorEndpoints };
  }

  hardParams(word) {
    const answer = word.components.map((c) => c.value).join('');
    const components = word.value.split('').map((char) => ({ value: char, guess: null }));
    const cursorEndpoints = [0, answer.length - 1];
    return { answer: answer, components: components, cursorEndpoints: cursorEndpoints };
  }

  pressedHint = async () => {
    if (this.state.hintDisabled) { return; }
    this.props.incrementHintCount();

    this.state.hintCount === 0
      ? this.revealRootsinDefinition()
      : this.giveAwayLetter();

    this.setState({ hintCount: this.state.hintCount + 1 });
    this.toggleHintDisabled(); await sleep(1000); this.toggleHintDisabled();
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
    const definition = this.state.definition.map((part) => {
      const rootComponent = _.find(this.state.word.components, (c) => c.definition === part.value);
      return part.isRoot && rootComponent
        ? { isRoot: true, value: `${part.value} (${rootComponent.value.toUpperCase()})` }
        : part
    });
    this.setState({ definition });
  }

  handleClick(idx) {
    if (_.contains(_.range(this.state.cursorEndpoints[0], this.state.cursorEndpoints[1] + 1), idx)) {
      this.setState({ cursor: idx });
    }
  }

  render() {
    const definition = () => {
      return this.state.definition.map((p, idx) => {
        return <span key={idx} style={{color: p.isRoot ? '#F5A50E' : 'black'}}>{p.value}</span>
      })
    }

    const answerSpaces = () => {
      return this.state.components.map((c, idx) => {
        const correct = c.guess && c.value.toLowerCase() === c.guess.toLowerCase();
        return <AnswerSpace
          correct={correct}
          onClick={() => this.handleClick(idx)}
          displayErrors={c.guess && this.state.displayErrors}
          cursorOn={this.state.cursor === idx}
          key={idx}>{c.guess ? c.guess.toUpperCase() : toUnderscore(c.value)}
        </AnswerSpace>
      })
    }

    return (
      <div style={{marginTop:'25px'}}>
        <Definition>{definition()}</Definition>
        <div>{answerSpaces()}</div>
        <HintButton show={!this.props.isDisplayingImage} type='button' onClick={() => this.pressedHint()}>Hint</HintButton>
      </div>
    );
  }
}

const AnswerSpace = styled.p`
  color: ${
    props => props.displayErrors ? props.correct ? color.green : color.red : color.black
  };
  display: inline-block;
  font-size: 2.5em;
  margin: 0% 1% 0% 1%;
  &::before {
     content: "I";
     color: ${props => props.cursorOn ? color.blue : 'transparent'};
     animation: ${props => props.cursorOn ? 'blink 1s step-end infinite' : 'none'};
     @keyframes blink {
       50% { opacity: 0; }
     }
     padding-right: 2px;
  }
  cursor: pointer;
`

const Definition = styled.div`
  font-size: 1.75em;
  line-height: 35px;
  margin: auto;
  margin-bottom: 1em;
  width: 75%
`

const HintButton = Button.medium.extend`
  margin-top: 50px;
  display: ${props => props.show ? 'normal' : 'none'};
  background-color: ${color.blue};
  &:hover {
    background-color: ${color.blue10l};
  }
`

const mapStateToProps = (state, ownProps) => ({
  roots: _.values(state.entities.roots),
  words: _.values(state.entities.words) 
});

export default connect(mapStateToProps)(SpellQuestion)
