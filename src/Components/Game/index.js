import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';

import Buttons from '../Buttons/default';
import Firebase from '../../Networking/Firebase';
import OnCorrectImage from '../OnCorrectImage/index';
import Timer from '../Timer/index';
import Word from '../../Models/Word';
import { color } from '../../Assets/Styles/index';

class Game extends Component {
  constructor(props) {
    super(props);

    const isSinglePlayer = this.props.accessCode === undefined;

    this.state = {
      choices: [],
      correct: true,
      currentWord: null,
      dataLoaded: false,
      displayImage: false,
      questionCount: 0,
      roots: [],
      score: 0,
      isSinglePlayer: isSinglePlayer,
      wordComponents: [],
      words: []
    }
  }

  async componentDidMount() {
    if (this.state.isSinglePlayer) {
      const words = await Firebase.fetchWords();
      const roots = _.uniq(_.flatten(words.map((w) => w.roots)), 'value');
      this.timer.track();
      this.setState({ words: words, roots: roots, dataLoaded: true }, this.nextWord);
    }
  }

  nextWord() {
    const word = this.randomItem(this.state.words);
    const components = word.components.map((c) => {
      return { value: c.value, display: c.type !== 'root' };
    });
    const choices = this.choicesFor(word);
    const score = this.state.score + (this.state.correct && (this.state.questionCount > 0) ? 1 : 0);
    const questionCount = this.state.questionCount + 1;
    this.setState({
      choices: choices,
      correct: true,
      currentWord: word,
      displayImage: false,
      questionCount: questionCount,
      score: score,
      wordComponents: components
    });
  }

  checkComplete() {
    if (_.contains(_.pluck(this.state.wordComponents, 'display'), false)) { return };

    if (this.wordImage.state.source || true) {
      this.setState({ displayImage: true });
    }

    _.delay(this.nextWord.bind(this), 1000);
  }

  choicesFor(word) {
    const correct = word.roots;
    const exclude = _.pluck(correct, 'value');
    const redHerrings = this.redHerrings(exclude);
    return _.shuffle(correct.concat(redHerrings));
  }

  guessed(choice) {
    const updatedComponents = this.state.wordComponents.map((c) => {
      return c.value === choice ? { value: c.value, display: true } : c;
    });
    const incorrect = _.isEqual(this.state.wordComponents, updatedComponents);
    if (incorrect) {
      this.setState({ correct: false });
    } else {
      this.setState({ wordComponents: updatedComponents }, this.checkComplete);
    }
  }

  randomItem(arr) {
    return arr[Math.floor(Math.random()*arr.length)];
  }

  redHerrings(exclude) {
    const amount = 6 - exclude.length;
    return _.shuffle(this.state.roots.filter((r) => !_.contains(exclude, r.value))).slice(0, amount);
  }

  toUnderscore(str) {
    return str.split('').map((c) => '_').join('')
  }

  render() {
    const definition = () => {
      if (_.isNull(this.state.currentWord)) { return };
      return this.state.currentWord.definition.map((p) => {
        return <span style={{color: p.isRoot ? '#F5A50E' : 'black'}}>{p.value}</span>
      })
    }

    const answerSpaces = () => {
      return this.state.wordComponents.map((c) => {
        return <AnswerSpace>{c.display ? c.value : this.toUnderscore(c.value)}</AnswerSpace>
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
        <Scoreboard>
          <Score>{this.state.score}</Score>
          <Timer ref={instance => { this.timer = instance }} />
        </Scoreboard>
        <Definition>{definition()}</Definition>
        <AnswerSpaces>{answerSpaces()}</AnswerSpaces>
        <GameButtons display={!this.state.displayImage}>{buttons()}</GameButtons>
        <OnCorrectImage 
          display={this.state.displayImage} 
          ref={instance => { this.wordImage = instance }} 
          word={this.state.currentWord} />
      </Layout>
    );
  }
}

const Layout = styled.div`
  text-align: center;
`

const Scoreboard = styled.div`
  display: flex;
  justify-content: center;
`

const Score = styled.p`
  font-size: 4em;
  margin-right: 10px;
`

const Definition = styled.div`
  font-size: 2.5em;
`

const AnswerSpaces = styled.div`
  margin: 5% 0% 5% 0%;
`

const AnswerSpace = styled.p`
  margin: 0% 1% 0% 1%;
  font-size: 2.5em;
  display: inline-block;
`

const GameButtons = styled.div`
  display: ${props => props.display ? 'flex' : 'none'};;
  flex-wrap: wrap;
  justify-content: center;
`

const GameButton = Buttons.large.extend`
  background-color: ${color.blue};
  &:hover {
    background-color: ${color.blue10l};
  }
  margin: 10px;
  width: 250px;
  font-size: 2em;
`

export default Game;
