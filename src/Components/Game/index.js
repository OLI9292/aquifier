import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';

import ActionButton from '../Buttons/action';
import Firebase from '../../Networking/Firebase';

import ButtonQuestion from '../Question/button';
import OnCorrectImage from '../OnCorrectImage/index';
import SpellQuestion from '../Question/spell';
import Word from '../../Models/Word';
import Timer from '../Timer/index';

import { color } from '../../Library/Styles/index';

class Game extends Component {
  constructor(props) {
    super(props);

    const isSinglePlayer = this.props.accessCode === undefined;

    this.state = {
      choices: [],
      currentWord: null,
      dataLoaded: false,
      isQuestionInterlude: false,
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
    let words = await Firebase.fetchWords();
    const roots = _.uniq(_.flatten(words.map((w) => w.roots)), 'value');

    if (this.state.isSinglePlayer) {
      this.timer.track();
      this.setState({ words: words, roots: roots, level: this.props.level }, this.nextQuestion);
    } else {
      Firebase.refs.games.child(this.props.accessCode).on('value', (snapshot) => {
        const level = snapshot.val().level;
        const wordOrder = snapshot.val().words.split(',');
        const lateness = this.secondsEnteredLate(snapshot.val().startTime);
        this.timer.track(lateness);
        this.setState({ words: words, roots: roots, level: level, wordOrder: wordOrder }, this.nextQuestion);
      })
    }

    // TODO: - remove on unmount
    document.body.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && this.state.isQuestionInterlude) {
        this.skipAhead();
      }
    });
  }

  secondsEnteredLate(startTime) {
    return Math.floor(((new Date()).getTime() - startTime) / 1000);
  }

  skipAhead() {
    clearTimeout(window.timeout);
    this.nextQuestion();
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

  incrementScore() {
    this.setState({ score: this.state.score + 1 });
  }

  runQuestionInterlude = async () =>  {
    this.setState({ isQuestionInterlude: true });
    window.timeout = setTimeout(() => { 
      this.nextQuestion();
    }, 1500);
  }

  nextQuestion() {
    // Move onto the next question
    const word = this.getWord();
    this.setState({ currentWord: word, isQuestionInterlude: false, questionCount: this.state.questionCount + 1 });
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
          nextQuestion={this.runQuestionInterlude.bind(this)}
          isDisplayingImage={this.state.isQuestionInterlude}
          incrementScore={this.incrementScore.bind(this)}
          roots={this.state.roots}
          word={this.state.currentWord} />
      } else {
        return <SpellQuestion
          level={this.props.level}
          nextQuestion={this.runQuestionInterlude.bind(this)}
          isDisplayingImage={this.state.isQuestionInterlude}
          roots={this.state.roots}
          word={this.state.currentWord} />          
      }
    }

    return (
      <Layout>
        <SmallText display={this.state.isQuestionInterlude}>Press ENTER to skip ahead</SmallText>
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
          display={this.state.isQuestionInterlude} 
          ref={instance => { this.wordImage = instance }} 
          word={this.state.currentWord} />
      </Layout>
    );
  }
}

const SmallText = styled.p`
  visibility: ${props => props.display ? 'visible' : 'hidden'};
  color: ${color.gray};
  text-align: right;
  padding: 10px 10px 0px 0px;
`

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
  line-height: 0px;
  margin-right: 10px;
`

const Text = styled.h4`
  font-size: 2em;
`

export default Game;
