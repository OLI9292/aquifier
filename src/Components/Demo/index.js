import React, { Component } from 'react';
import './index.css';
import ButtonType from '../../Models/ButtonType';
import Firebase from '../../Networking/Firebase';
import ActionButton from '../ActionButton/index';
import Timer from '../Timer/index';
import Word from '../../Models/Word';
import _ from 'underscore';

class Demo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      choices: [],
      currentWord: null,
      dataLoaded: false,
      roots: [],
      score: 0,
      wordComponents: [],
      words: []
    }
  }

  componentDidMount() {
    Firebase.words.on('value', (snapshot) => {
      let wordObj = snapshot.val();
      const words = _.keys(wordObj).map((val) => Word(val, wordObj[val]));
      const roots = _.flatten(words.map((w) => w.roots));
      this.setState({ words: words, roots: roots, dataLoaded: true }, this.nextWord);
    });
  }

  nextWord() {
    const word = this.randomItem(this.state.words);
    const components = word.components.map((c) => { 
      return { value: c.value, display: c.type !== 'root' };
    });
    this.setState({ currentWord: word, wordComponents: components, choices: this.choicesFor(word) });
  }

  checkComplete() {
    if (_.contains(_.pluck(this.state.wordComponents, 'display'), false)) { return };
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
    this.setState({ wordComponents: updatedComponents }, this.checkComplete);
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
        return <span>{c.display ? c.value : this.toUnderscore(c.value)}</span>
      })
    }

    const buttons = () => {
      return this.state.choices.map((c) => {
        return <div
          className="game-button"
          key={c.value}
          onClick={() => {this.guessed(c.value)}}><p>{c.value.toUpperCase()}<br />{c.definition}</p></div>
      })
    }

    return (
      <div className="demo-container">
        <div className="scoreboard">
          <div className="score">
            <p>{this.state.score}</p>
          </div>
          <Timer />
        </div>
        <div className="definition">
          {definition()}
        </div>
        <div className="answerSpaces">
          {answerSpaces()}
        </div>
        <div className="game-buttons">
          {buttons()}
        </div>
        <div className="action-buttons">
          <ActionButton type="download" />
          <ActionButton type="bringToSchool" />
        </div>
      </div>
    );
  }
}

export default Demo;
