import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';

import ActionButton from '../Buttons/action';
import Firebase from '../../Networking/Firebase';

import ButtonQuestion from '../Question/button';
import SpellQuestion from '../Question/spell';
import Word from '../../Models/Word';
import Spell from '../Question/spell';

import OnCorrectImage from '../OnCorrectImage/index';
import Timer from '../Timer/index';
import { sleep } from '../../Library/helpers';

class Game extends Component {
  constructor(props) {
    super(props);

    const isSinglePlayer = this.props.accessCode === undefined;

    this.state = {
      choices: [],
      currentWord: null,
      dataLoaded: false,
      displayImage: false,
      gameOver: false,
      level: 'Beginner',
      questionCount: 0,
      redirect: null,
      roots: [],
      score: 0,
      isSinglePlayer: isSinglePlayer,
      words: [],
      wordOrder: []
    }
  }

  async componentDidMount() {
    const words = [Word()];
    const roots = _.uniq(_.flatten(words.map((w) => w.roots)), 'value').concat([{ value: 'vor' }, { value: 'astr' }, { value: 'herb' }, { value: 'insect' }]);
    // let words = await Firebase.fetchWords();
    // const roots = _.uniq(_.flatten(words.map((w) => w.roots)), 'value');

    if (this.state.isSinglePlayer) {
      // this.timer.track();
      this.setState({ words: words, roots: roots, level: this.props.level }, this.nextQuestion);
    } else {
      Firebase.refs.games.child(this.props.accessCode).on('value', (snapshot) => {
        const level = snapshot.val().level;
        const wordOrder = snapshot.val().words.split(',');
        // this.timer.track();
        this.setState({ words: words, roots: roots, level: level, wordOrder: wordOrder }, this.nextQuestion);
      })
    }
  }

  getWord() {
    if (this.state.isSinglePlayer || _.isEmpty(this.state.wordOrder)) {
      return this.randomItem(this.state.words);
    } else {
      const next = _.find(this.state.words, (w) => w.value === this.state.wordOrder[0]);
      this.setState({ wordOrder: this.state.wordOrder.slice(1, this.state.wordOrder.length )});
      return next !== undefined ? next : this.getWord();
    }
  }

  nextQuestion = async () => {
    // Display image for a second if it exists
    this.setState({ displayImage: true });
    await sleep(1000);
    // Move onto the next question
    const word = this.getWord();
    const score = this.state.score + (this.state.correct && (this.state.questionCount > 0) ? 1 : 0);
    const questionCount = this.state.questionCount + 1;
    this.setState({ currentWord: word, displayImage: false, questionCount: questionCount, score: score });
  }

  randomItem(arr) {
    return arr[Math.floor(Math.random()*arr.length)];
  }

  gameOver() {
    this.setState({ gameOver: true });
  }

  redirect(location) {
    this.setState({ redirect: location })
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect} />;
    }

    const gameOver = () => {
      return this.state.isSinglePlayer
        ? <Container>
            <Text>You scored {this.state.score}.</Text>
            {ActionButton('singlePlayer', this.redirect.bind(this))}
            {ActionButton('ios')}
            {ActionButton('android')}
          </Container>
        : <Redirect push to={`/game/${this.props.accessCode}/over`} />
    }

    const question = () => {
      if (this.state.level === 'Beginner') {
        return <ButtonQuestion
          level={this.props.level}
          nextQuestion={this.nextQuestion.bind(this)}
          isDisplayingImage={this.state.displayImage}
          roots={this.state.roots}
          word={this.state.currentWord} />
      } else {
        return <SpellQuestion
          level={this.props.level}
          nextQuestion={this.nextQuestion.bind(this)}
          isDisplayingImage={this.state.displayImage}
          roots={this.state.roots}
          word={this.state.currentWord} />          
      }
    }

    return (
      <Layout>
        <Scoreboard>
          <Score>{this.state.score}</Score>
          <Timer
            time={this.props.time}
            ref={instance => { this.timer = instance }}
            gameOver={this.gameOver.bind(this)} />
        </Scoreboard>
        {
          this.state.gameOver 
            ? gameOver()
            : !_.isNull(this.state.currentWord) && question()
        }
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

const Container = styled.div`
`

const Scoreboard = styled.div`
  display: flex;
  justify-content: center;
`

const Score = styled.p`
  font-size: 4em;
  margin-right: 10px;
`

const Text = styled.h4`
  font-size: 2em;
`

export default Game;
