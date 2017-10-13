import React, { Component } from 'react';
import { Redirect } from 'react-router';
import queryString from 'query-string';
import styled from 'styled-components';
import _ from 'underscore';

import ActionButton from '../Buttons/action';
import Firebase from '../../Networking/Firebase';

import ButtonQuestion from '../Question/button';
import OnCorrectImage from '../OnCorrectImage/index';
import SpellQuestion from '../Question/spell';
import Word from '../../Models/Word';
import Timer from '../Timer/index';

import { toArr } from '../../Library/helpers';
import { color } from '../../Library/Styles/index';
import leftArrow from '../../Library/Images/left-arrow.png';
import rightArrow from '../../Library/Images/right-arrow.png';
import enterKey from '../../Library/Images/enter.png';
import equalsKey from '../../Library/Images/equals.png';

class Game extends Component {
  constructor(props) {
    super(props);

    const isSinglePlayer = this.props.settings.accessCode === undefined;

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

  matchesCategory(a, b) {
    return _.intersection(a.map((x) => x.toLowerCase()), toArr(b).map((y) => y.toLowerCase())).length > 0
  }

  async componentDidMount() {
    let words = await Firebase.fetchWords();
    const roots = _.uniq(_.flatten(words.map((w) => w.roots)), 'value');

    if (this.state.isSinglePlayer) {
      const wordOrder = _.shuffle(_.pluck(words.filter((w) => this.matchesCategory(w.categories, this.props.settings.topic)), 'value'));
      this.timer.track();
      this.setState({ words: words, roots: roots, level: this.props.settings.level, wordOrder: wordOrder }, this.nextQuestion);
    } else {
      Firebase.refs.games.child(this.props.settings.accessCode).on('value', (snapshot) => {
        const level = snapshot.val().level;
        const wordOrder = snapshot.val().words === '' ? [] : snapshot.val().words.split(',');
        const lateness = this.secondsEnteredLate(snapshot.val().startTime);
        this.timer.track(lateness);
        this.setState({ words: words, roots: roots, level: level, wordOrder: wordOrder }, this.nextQuestion);
      })
    }

    document.body.addEventListener('keydown', this.handleKeydown.bind(this), true);
  }

  handleKeydown(event) {
    if (event.key === 'Enter' && this.state.isQuestionInterlude) {
      this.skipAhead();
    }
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.handleKeydown, true);
    if (!this.state.isSinglePlayer) {
      Firebase.refs.games.child(this.props.settings.accessCode).off();
    }
  }

  secondsEnteredLate(startTime) {
    return Math.floor(((new Date()).getTime() - startTime) / 1000);
  }

  skipAhead() {
    clearTimeout(window.timeout);
    this.nextQuestion();
  }

  getWord() {
    if (_.isEmpty(this.state.wordOrder)) {
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
    }, 4000);
  }

  nextQuestion() {
    const word = this.getWord();
    this.setState({ currentWord: word, isQuestionInterlude: false, questionCount: this.state.questionCount + 1 });
  }

  randomItem(arr) {
    return arr[Math.floor(Math.random()*arr.length)];
  }

  submitScore() {
    const ref = Firebase.refs.games.child(this.props.settings.accessCode).child('players').child(this.props.settings.name);
    ref.set(this.state.score);
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
      if (this.state.isSinglePlayer) {
        return <GameOverContainer>
          <Text>You scored {this.state.score}.</Text>
          <ButtonContainer>{ActionButton('singlePlayer', this.redirect.bind(this))}</ButtonContainer>
          <ButtonContainer>{ActionButton('ios')}</ButtonContainer>
          <ButtonContainer>{ActionButton('android')}</ButtonContainer>
        </GameOverContainer>
      } else {
        this.submitScore();
        const settings = _.mapObject(this.props.settings, (v, k) => k === 'component' ? 'leaderboard' : v);
        return <Redirect push to={`/game/${queryString.stringify(settings)}`} />;
      }
    }

    const question = () => {
      if (this.state.level === 'Beginner') {
        return <ButtonQuestion
          level={this.state.level}
          nextQuestion={this.runQuestionInterlude.bind(this)}
          isDisplayingImage={this.state.isQuestionInterlude}
          incrementScore={this.incrementScore.bind(this)}
          roots={this.state.roots}
          word={this.state.currentWord} />
      } else {
        return <SpellQuestion
          level={this.state.level}
          nextQuestion={this.runQuestionInterlude.bind(this)}
          isDisplayingImage={this.state.isQuestionInterlude}
          incrementScore={this.incrementScore.bind(this)}
          roots={this.state.roots}
          word={this.state.currentWord} />
      }
    }

    const directions = () => {
      return <Directions display={!this.state.isQuestionInterlude}>
        <DirectionsCell>
          <DirectionsText>Move</DirectionsText>
          <Image src={leftArrow} />
          <Image src={rightArrow} />
        </DirectionsCell>
        <DirectionsCell>
          <DirectionsText>Hint</DirectionsText>
          <Image src={equalsKey} />
        </DirectionsCell>
        <DirectionsCell>
          <DirectionsText>Check Answer</DirectionsText>
          <Image src={enterKey} />
        </DirectionsCell>
      </Directions>
    }

    return (
      <Layout>
        <SmallText display={this.state.isQuestionInterlude}>Press ENTER to skip ahead</SmallText>
        <Scoreboard>
          <Timer
            time={this.props.settings.time}
            ref={instance => { this.timer = instance }}
            gameOver={this.gameOver.bind(this)} />
          <Score>{this.state.score}</Score>
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
        {this.state.level !== 'Beginner' && directions()}
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
  height: 100%;
`

const GameOverContainer = styled.div`
`

const ButtonContainer = styled.div`
  display: block;
`

const Scoreboard = styled.div`
  text-align: left;
  margin: 0 auto;
  margin-top: -30px;
  width: 250px;
`

const Score = styled.p`
  font-size: 4em;
  display: inline-block;
  float: right;
  line-height: 0px;
  margin-right: 10px;

  @media (max-width: 1000px), ( max-height: 700px ) {
    font-size: 3em;
  }
`

const Text = styled.h4`
  font-size: 2em;
`

// Directions components
const Directions = styled.div`
  display: ${props => props.display ? 'normal' : 'none'};
  text-align: left;
  margin: 0px 0px 80px 20px;
  width: 400px;
  bottom: 0;
  position: absolute;
`

const DirectionsCell = styled.div`
  display: inline-block;
  height: 100px;
  width: 125px;
`

const Image = styled.img`
  height: 35px;
  width: auto;
`

const DirectionsText = styled.h4`
  text-align: left;
  color: ${color.gray};
`

export default Game;
