import { connect } from 'react-redux'
import Firebase from '../../Networking/Firebase';
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import moment from 'moment';
import _ from 'underscore';

import ButtonQuestion from './Questions/button';
import Directions from './directions';
import GameOver from './gameOver';
import OnCorrectImage from './onCorrectImage';
import ProgressBar from '../ProgressBar/index';
import SentenceCompletionQuestion from './Questions/sentenceCompletion';
import SpellQuestion from './Questions/spell';

import { color } from '../../Library/Styles/index';
import speedyPng from '../../Library/Images/speedy.png';
import nextButton from '../../Library/Images/next-button.png';
import { shouldRedirect } from '../../Library/helpers';
import { loadWordLists, loadLessons, saveQuestion, saveStats } from '../../Actions/index';

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameOver: false,
      question: null,
      questions: [],
      nextQuestionIndex: 0,
      score: 0,
      stats: [],
      time: 0,
      hintCount: 0,
      incorrectGuessCount: 0
    }

    this.handleKeydown = this.handleKeydown.bind(this);
  }

  async componentDidMount() {
    document.body.addEventListener('keydown', this.handleKeydown);

    const refreshInterval = setInterval(() => this.setState({ time: this.state.time + 1 }), 1000);
    this.setState({ refreshInterval });

    const isTimed = Number.isInteger(parseInt(this.props.settings.time, 10));
    const isMultiplayer = this.props.settings.players === 'multi';
    
    // TODO: - check this is a consistent username
    const username = this.props.user && `${this.props.user.firstName} ${this.props.user.lastName.charAt(0)}`;

    this.setState({
      isTimed: isTimed,
      isMultiplayer: isMultiplayer,
      username: username 
    }, () => this.setupGame(this.props));
  }

  componentWillReceiveProps(nextProps) {
    this.setupGame(nextProps);
  }

  componentWillUnmount() {
    if (this.state.isMultiplayer && !this.state.gameOver) {
      Firebase.refs.games.child(this.props.settings.accessCode).child('players').child(this.state.username).remove();
    }

    clearInterval(this.state.refreshInterval);
    document.body.removeEventListener('keydown', this.handleKeydown);

    const stats = this.state.stats;
    const wordList = this.state.gameOver ? this.props.settings.wordList : null;

    if (this.props.user && stats.length) { 
      const data = {
        id: this.props.user._id,
        stats: stats,
        platform: 'web',
        wordList: wordList
      };
      this.props.dispatch(saveStats(data, this.props.session));
    }
  }

  currentProgress() {
    return this.state.nextQuestionIndex / this.state.questions.length || 0;
  }

  difficultyFor(integer) {
    return _.contains([0,1,2], integer) ? ['button', 'spellEasy', 'spellHard'][integer] : 'button';
  }

  displayOnCorrect() {
    return this.state.isInterlude && this.state.question.type !== 'sentenceCompletion';
  }  

  gameOver() {
    this.setState({ gameOver: true });

    if (this.state.isMultiplayer && this.state.username) {
      const ref = Firebase.refs.games.child(this.props.settings.accessCode).child('players').child(this.state.username);
      if (ref) { ref.set(this.state.score); };
    }
  }

  handleSaveQuestion(correct) {
    const answeredAt = moment().format();
    const mobile = false;
    const hintsUsed = this.state.hintCount;
    const incorrectGuesses = this.state.incorrectGuessCount;
    const timeSpent = this.state.time;
    const type = this.state.question.type.includes('spell') ? 'spell' : this.state.question.type;
    const userId = this.props.user && this.props.user._id;
    const word = this.state.question.word.value;
    const sessionId = this.props.session && this.props.session.sessionId;
    const answers = null;
    const choices = null;

    const data = { answered_at: answeredAt, answers: answers, choices: choices,
      correct: correct, mobile: mobile, hints_used: hintsUsed, incorrect_guesses: incorrectGuesses,
      session_id: sessionId, time_spent: timeSpent, type: type, user_id: userId, word: word };

    this.props.dispatch(saveQuestion(data));
  }

  handleKeydown(e) {
    e.preventDefault();
    
    if (e.key === 'Enter' && this.state.isInterlude) {
      clearTimeout(window.timeout);
      this.nextQuestion();
    }
  }  

  lessonStages(data) {
    const stage1 = _.shuffle(data.map((q) => ({ word: q.word, type: 'button' })));
    const stage2 = data.map((q) => ({ word: q.word, context: q.context, type: 'sentenceCompletion' }));
    const stage3 = _.flatten(data.map((q) => _.shuffle(_.union(q.related, [q.word]).map((w) => ({ word: w, type: 'button' })))));
    const questions = _.flatten([stage1, stage2, stage3]);
    const checkpoints = [stage1.length / questions.length, (stage1.length + stage2.length) / questions.length, 1]
    return [questions, checkpoints];
  }  

  nextQuestion = async () => {
    if (!this.state.isTimed && this.state.nextQuestionIndex === this.state.questions.length) {
      this.gameOver();
      return;
    }

    this.setState({ isInterlude: false, isSpeedy: false });

    const questionIndex = this.state.nextQuestionIndex;

    if (questionIndex === this.state.questions.length) {
      const questions = _.shuffle(this.state.questions);
      this.setState({ nextQuestionIndex: 0, questions: questions }, this.nextQuestion);
    } else {
      const question = _.clone(this.state.questions[questionIndex]);
      const word = _.find(this.props.words, (w) => w.value === question.word);
      if (word) {
        question.word = word;
        this.setState({
          question: question,
          hintCount: 0,
          incorrectGuessCount: 0,
          nextQuestionIndex: questionIndex + 1,
          time: 0 
      });
      } else {
        this.setState({ nextQuestionIndex: questionIndex + 1 }, this.nextQuestion);
      }
    }
  }  

  record(correct) {
    const difficulties = {
      'button': 3,
      'spellEasy': 6,
      'spellHard': 10,
      'sentenceCompletion': 10
    };

    const data = {
      word: this.state.question.word.value,
      correct: correct,
      time: Math.min(this.state.time, 10),
      difficulty: difficulties[this.state.question.type] || 10
    };

    if (!_.contains(_.pluck(this.state.stats, 'word'), data.word)) {
      this.setState({ stats: _.union(this.state.stats, [data]) });
    }
  }  

  runInterlude = async (correct = true) => {
    this.record(correct);
    
    const state = { isInterlude: true };
    
    if (correct) {
      const isSpeedy = this.state.time < 5;
      state.isSpeedy = isSpeedy;
      state.score = this.state.score + (isSpeedy ? 2 : 1);
    }

    this.setState(state);
    this.handleSaveQuestion(correct);
    window.timeout = setTimeout(() => { this.nextQuestion() }, 3000000);
  }  

  setupGame = async (props) => {
    if (!this.state.loaded && props.words.length && props.roots.length) {
      this.setState({ loaded: true });

      if (this.props.settings.reading) {
        let lesson
        lesson = _.find(this.props.lessons, (l) => l._id === this.props.settings.reading);

        if (!lesson) {
          const result = await this.props.dispatch(loadLessons(this.state.gameId));
          if (!result.error) { lesson = _.first(_.values(result.response.entities.lessons)); }
        }

        if (lesson) {
          const [questions, checkpoints] = this.lessonStages(lesson.questions);

          this.setState({
            name: lesson.name,
            gameId: this.props.settings.reading,
            questions: questions,
            checkpoints: checkpoints
          },this.nextQuestion);
        }
      }

      if (this.props.settings.wordList) {
        let wordList
        wordList = _.find(this.props.wordLists, (w) => w._id === this.props.settings.wordList);

        if (!wordList) {
          const result = await this.props.dispatch(loadWordLists(this.state.gameId));

          if (!result.error) {
            const wordLists = result.response.entities.wordLists;
            wordList = _.find(wordLists, (w) => w._id === this.props.settings.wordList);
          }
        }

        if (wordList) {
          this.startTimer();

          this.setState({
            name: wordList.name,
            questions: wordList.questions.map((q) => { q.type = this.difficultyFor(q.difficulty); return q }),
          }, this.nextQuestion)
        }
      }      
    }
  }

  startTimer() {
    const time = this.props.settings.startTime || new Date();
    this.timer.start(time);    
  }

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }

    const question = () => {
      const type = this.state.question.type;
      if (type === 'sentenceCompletion') {
        return <SentenceCompletionQuestion
          incrementIncorrectGuesses={() => this.setState({ incorrectGuessCount: this.state.incorrectGuessCount + 1 })}
          incrementHintCount={() => this.setState({ hintCount: this.state.hintCount + 1 })}
          question={this.state.question}
          nextQuestion={this.runInterlude.bind(this)} />
      } else if (type.startsWith('spell')) {
        return <SpellQuestion
          incrementIncorrectGuesses={() => this.setState({ incorrectGuessCount: this.state.incorrectGuessCount + 1 })}
          incrementHintCount={() => this.setState({ hintCount: this.state.hintCount + 1 })}
          word={this.state.question.word}
          isEasy={type === 'spellEasy'}
          nextQuestion={this.runInterlude.bind(this)} />
      } else {
        return <ButtonQuestion
          incrementIncorrectGuesses={() => this.setState({ incorrectGuessCount: this.state.incorrectGuessCount + 1 })}
          word={this.state.question.word}
          nextQuestion={this.runInterlude.bind(this)} />
      }
    }

    const game = () => {
      return <div>
        <div >
          <h4 style={{fontSize:'1.2em',padding:'10px 0px 0px 10px',height:'0px'}}>
            {this.state.name}
          </h4>

          <SpeedyContainer show={this.state.isSpeedy}>
            <img src={speedyPng} alt='speedy-flame' style={{height:'100%',width:'auto'}} />
            <p style={{color:color.red,fontSize:'1.25em'}}>Speedy! +2</p>
          </SpeedyContainer>

          <div style={{width:'30%',margin:'0 auto'}}>
            {
              this.state.isTimed
              ?
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-around',marginTop:'-35px'}}>
                <Timer
                  time={this.props.settings.time}
                  ref={instance => { this.timer = instance }}
                  gameOver={() => this.gameOver()} />
                <p style={{fontSize:'3em',height:'0px',lineHeight:'0px'}}>
                  {this.state.score}
                </p>
              </div>
              :
              <ProgressBar width={this.currentProgress()} checkpoints={this.state.checkpoints || []} />
            }
          </div>
        </div>

        <div style={{width:'85%',margin:'0 auto',textAlign:'center'}}>
          {
            this.state.question && !this.displayOnCorrect() && question()
          }
          {
            this.state.question && <OnCorrectImage word={this.state.question.word} display={this.displayOnCorrect()} />
          }
        </div>

        <Directions isInterlude={this.state.isInterlude} />

        <NextButton src={nextButton} alt='next-Button'
          onClick={() => this.nextQuestion()}
          visibile={this.state.isInterlude} />
      </div>
    }

    return (
      <div>
        {
          this.state.gameOver
          ? 
          <GameOver score={this.state.score} name={this.state.name} /> 
          : game()
        }
      </div>
    );
  }
}

const SpeedyContainer = styled.div`
  display: ${props => props.show ? 'flex' : 'none'};
  justify-content: space-evenly;
  align-items: center;
  width: 150px;
  height: 35px;
  float: right;
  margin: -10px 10px 0px 0px;
`

const NextButton = styled.img`
  visibility: ${props => props.visibile ? 'visibile' : 'hidden'};
  position: absolute;
  height: 50px;
  width: auto;
  bottom: 20px;
  right: 20px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`

const mapStateToProps = (state, ownProps) => ({
  session: state.entities.session,
  lessons: _.values(state.entities.lessons),
  roots: _.values(state.entities.roots),
  user: _.first(_.values(state.entities.user)),
  words: _.values(state.entities.words),
  wordLists: _.values(state.entities.wordLists)
});

export default connect(mapStateToProps)(Game)
