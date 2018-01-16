import { connect } from 'react-redux'
import Firebase from '../../Networking/Firebase';
import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';

import ButtonQuestion from './Questions/button';
import OnCorrectImage from './onCorrectImage';
import ProgressBar from '../ProgressBar/index';
import SpellQuestion from './Questions/spell';
import { color } from '../../Library/Styles/index';

class Collaborative extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userAnswers: [],
      answers: [],
      answered: [],
      incorrectGuessCount: 0,
      hintCount: 0
    }
  }

  componentDidMount() {
    if (this.props.words.length) { this.startGame(this.props.words) }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.words.length && !this.state.word) { this.startGame(nextProps.words) }
  }

  wordPool(words, answers, size) {
    const [keyWords, not] = _.partition(words, w => _.contains(answers, w.value));
    return _.shuffle(_.union(_.sample(not, size - keyWords.length), keyWords));
  }

  startGame(words) {
    const accessCode = this.props.settings.accessCode;

    // Poll Firebase    
    Firebase.refs.games.child(accessCode).on('value', (snap) => {
      const answers = snap.val().answers.split(',');
      const answered = _.flatten(_.map(_.values(snap.val().players), v => v === 0 ? [] : v.split(',')));

      const state = { answers: answers, answered: answered }
      if (!this.state.words) { state.words = this.wordPool(words, answers, 300) };

      this.setState(state, () => { if (!this.state.word) { this.setQuestion() }});
    });
  }

  runInterlude(correct) {
    if (this.state.keyWordFound && correct) {
      const userAnswers = _.union(this.state.userAnswers, [this.state.word.value]);
      this.setState({ userAnswers });
      const username = this.props.user && `${this.props.user.firstName} ${this.props.user.lastName.charAt(0)}`;
      const accessCode = this.props.settings.accessCode;
      Firebase.refs.games.child(accessCode).child('players').child(username).set(userAnswers.join(','));
    }

    this.setQuestion();
  }

  setQuestion() {
    const word = _.sample(this.state.words.filter(w => !_.isEqual(w, this.state.word)));
    const type = this.randomType(8, 1, 1);
    const keyWordFound = _.contains(this.state.answers, word && word.value);
    this.setState({ word: word, type: type, keyWordFound: keyWordFound });
  }

  randomType(w1, w2, w3) {
    return _.sample(_.flatten(_.zip([w1, w2, w3], ['button', 'spellEasy', 'spellHard'])
      .map((m) => _.times(m[0], _.constant(m[1])))));
  }

  render() {
    const question = () => {
      if (this.state.type.startsWith('spell')) {
        return <SpellQuestion
          incrementIncorrectGuesses={() => this.setState({ incorrectGuessCount: this.state.incorrectGuessCount + 1 })}
          incrementHintCount={() => this.setState({ hintCount: this.state.hintCount + 1 })}
          word={this.state.word}
          isEasy={this.state.type === 'spellEasy'}
          nextQuestion={this.runInterlude.bind(this)}/>
      } else {
        return <ButtonQuestion
          incrementIncorrectGuesses={() => this.setState({ incorrectGuessCount: this.state.incorrectGuessCount + 1 })}
          word={this.state.word}
          nextQuestion={this.runInterlude.bind(this)}/>
      }
    }

    return (
      <div style={{width:'80%',margin:'0 auto',textAlign:'center',paddingTop:'50px'}}>

        <Alert hide={!this.state.keyWordFound}>
          Key Word Found!
        </Alert>

        <div style={{width:'60%',margin:'0 auto'}}>
          <ProgressBar
            width={this.state.answered.length/this.state.answers.length}
            checkpoints={[]} />
        </div>

        {this.state.word && !this.state.isInterlude && question()}

        {this.state.word && 
          <OnCorrectImage
            word={this.state.word}
            display={this.state.isInterlude} />}
      </div>
    );
  }
}

const Alert = styled.p`
  visibility: ${props => props.hide ? 'hidden' : 'visibile'};
  position: absolute;
  top: 10px;
  right: 30px;
  font-size: 1.2em;
  color: ${color.green};
`

const mapStateToProps = (state, ownProps) => ({
  roots: _.values(state.entities.roots),
  words: _.values(state.entities.words),
  user: _.first(_.values(state.entities.user))
});

export default connect(mapStateToProps)(Collaborative)
