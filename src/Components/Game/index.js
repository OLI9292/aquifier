import Firebase from '../../Networking/Firebase';
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux'
import styled from 'styled-components';
import _ from 'underscore';

import SentenceCompletionQuestion from './Questions/sentenceCompletion';
import ButtonQuestion from './Questions/button';
import SpellQuestion from './Questions/spell';
import OnCorrectImage from './onCorrectImage';
import ProgressBar from '../ProgressBar/index';
import Button from '../Common/button';
import Timer from '../Timer/index';

import WordList from '../../Models/WordList';
import User from '../../Models/User';
import Lesson from '../../Models/Lesson';
import { color } from '../../Library/Styles/index';

import leftArrow from '../../Library/Images/left-arrow.png';
import rightArrow from '../../Library/Images/right-arrow.png';
import returnKey from '../../Library/Images/return.png';
import returnKeyGreen from '../../Library/Images/return-green.png';
import equalsKey from '../../Library/Images/equals.png';
import speedyPng from '../../Library/Images/speedy.png';
import nextButton from '../../Library/Images/next-button.png';

// ACTIONS
import { loadWords } from '../../Actions/index';

const loadData = props => {
  props.loadWords()
}

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
      time: 0
    }
  }

  async componentDidMount() {
    document.body.addEventListener('keydown', this.handleKeydown.bind(this), true);

    const refreshInterval = setInterval(() => this.setState({ time: this.state.time + 1 }), 1000);
    this.setState({ refreshInterval });

    const words = JSON.parse(localStorage.getItem('words'));
    const roots = JSON.parse(localStorage.getItem('roots'));

    const isTimed = Number.isInteger(parseInt(this.props.settings.time, 10));
    const isMultiplayer = this.props.settings.players === 'multi';
    const username = User.username();

    if (words && roots) {
      this.setState(
        { words: words, roots: roots, isTimed: isTimed, isMultiplayer: isMultiplayer, username: username },
        this.setupGame);
    }
  }

  componentWillUnmount() {
    if (this.state.isMultiplayer && !this.state.gameOver) {
      Firebase.refs.games.child(this.props.settings.accessCode).child('players').child(this.state.username).remove();
    }

    clearInterval(this.state.refreshInterval);
    document.body.removeEventListener('keydown', this.handleKeydown.bind(this), true);

    const userId = User.loggedIn('_id');
    const stats = this.state.stats;
    const wordList = this.state.gameOver ? this.props.settings.wordList : null;

    if (userId && stats.length) { User.saveStats(userId, stats, wordList); }
  }

  setupGame() {
    if (this.props.settings.reading) {
      const gameId = this.props.settings.reading;
      this.setState({ gameId }, this.setupLesson);
    } else if (this.props.settings.wordList) {
      const gameId = this.props.settings.wordList;
      this.setState({ gameId }, this.setupWordList);
    }
  }

  setupLesson = async () => {
    const result = await Lesson.fetch(this.state.gameId);
    const data = result.data.questions || [];
    const [questions, checkpoints] = this.lessonStages(data);

    this.setState({
      name: result.data.name,
      questions: questions,
      checkpoints: checkpoints
    }, this.nextQuestion);
  }

  handleKeydown(event) {
    if (event.key === 'Enter' && this.state.isInterlude) {
      clearTimeout(window.timeout);
      this.nextQuestion();
    }
  }

  setupWordList = async () => {
    const result = await WordList.fetch(this.state.gameId);
    if (result) {
      const wordList = result.data;
      const name = wordList.name;
      const questions = wordList.questions.map((q) => {
        const copy = q;
        q.type = this.difficultyFor(q.difficulty);
        return copy
      });

      const time = this.props.settings.startTime || new Date();
      this.timer.start(time);

      this.setState({
        name: name,
        questions: questions,
      }, this.nextQuestion)
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
    window.timeout = setTimeout(() => { this.nextQuestion() }, 300000);
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
      const word = _.find(this.state.words, (w) => w.value === question.word);
      if (word) {
        question.word = word;
        this.setState({ question: question, nextQuestionIndex: questionIndex + 1, time: 0 });
      } else {
        this.setState({ nextQuestionIndex: questionIndex + 1 }, this.nextQuestion);
      }
    }
  }

  difficultyFor(integer) {
    return _.contains([0,1,2], integer) ? ['button', 'spellEasy', 'spellHard'][integer] : 'button';
  }

  gameOver() {
    if (this.state.isMultiplayer && this.state.username) {
      const ref = Firebase.refs.games.child(this.props.settings.accessCode).child('players').child(this.state.username);
      if (ref) {
        ref.set(this.state.score);
      };
    }

    this.setState({ gameOver: true });
  }

  render() {
    console.log('PROPS')
    console.log(this.props)
    if (this.state.redirect && !window.location.href.endsWith(this.state.redirect)) {
      return <Redirect push to={this.state.redirect} />;
    }

    const progress = this.state.nextQuestionIndex / this.state.questions.length || 0;

    const question = () => {
      const type = this.state.question.type;
      if (type === 'sentenceCompletion') {
        return <SentenceCompletionQuestion
          question={this.state.question}
          nextQuestion={this.runInterlude.bind(this)}
          words={this.state.words}
          roots={this.state.roots} />
      } else if (type.startsWith('spell')) {
        return <SpellQuestion
          word={this.state.question.word}
          isEasy={type === 'spellEasy'}
          nextQuestion={this.runInterlude.bind(this)}
          words={this.state.words}
          roots={this.state.roots} />
      } else {
        return <ButtonQuestion
          word={this.state.question.word}
          nextQuestion={this.runInterlude.bind(this)}
          words={this.state.words}
          roots={this.state.roots} />
      }
    }

    const nextQuestionDirection = () => {
      if (this.state.isInterlude) {
        return <div style={{height:'25px', marginBottom:'30px'}}>
          <h4 style={{textAlign:'left',color:color.green,height:'5px',fontSize:'0.85em'}}>
            Next Question
          </h4>
            <img src={returnKeyGreen} alt='enter-key' style={{height:'100%',width:'auto'}} />
          </div>
      } else {
        return <div style={{height:'25px', marginBottom:'30px'}}>
          <h4 style={{textAlign:'left',color:color.gray,height:'5px',fontSize:'0.85em'}}>
              Check Answer
          </h4>
            <img src={returnKey} alt='enter-key' style={{height:'100%',width:'auto'}} />
        </div>
      }
    }

    const directions = () => {
      return <div style={{position:'absolute',bottom:'0',margin:'0px 0px 10px 10px'}}>
        <div style={{height:'25px', marginBottom:'30px'}}>
          <h4 style={{textAlign:'left',color:color.gray,height:'5px',fontSize:'0.85em'}}>Move</h4>
          <img src={leftArrow} alt='left-arrow' style={{height:'100%',width:'auto'}} />
          <img src={rightArrow} alt='right-arrow' style={{height:'100%',width:'auto'}} />
        </div>
        <div style={{height:'25px', marginBottom:'30px'}}>
          <h4 style={{textAlign:'left',color:color.gray,height:'5px',fontSize:'0.85em'}}>Hint</h4>
          <img src={equalsKey} alt='equals-key' style={{height:'100%',width:'auto'}} />
        </div>
          {nextQuestionDirection()}
      </div>
    }

    const userId = User.loggedIn('_id');

    const gameOver = () => {
      return <div style={{textAlign:'center',paddingTop:'25px'}}>
          <p style={{fontSize:'3em',marginTop:'25px'}}>
            <span style={{color:color.blue}}>{this.state.name}</span> Complete!
          </p>
          {this.state.score > 0 && <h1>{`You scored ${this.state.score}`}.</h1>}
            {!userId &&
            <div>
              <Text style={{fontSize:'2em'}}>Thanks for trying <span style={{color: color.yellow}}><b>WORDCRAFT!</b></span><br></br></Text>
              <Text> Create an account for the full curriculum, progress tracking,<br></br> and in-class multiplayer games.</Text>
            <Button.medium style={{marginTop:'25px'}} color={color.green} onClick={() => this.setState({ redirect: '/startfreetrial' })}>
              Start Free Trial
            </Button.medium>
            </div>
          }
            <div>
              <Button.medium style={{marginTop:'25px'}} color={color.blue} onClick={() => this.setState({ redirect: '/play' })}>
                Return
              </Button.medium>
            </div>
          </div>
    }

    const displayOnCorrect = this.state.isInterlude && this.state.question.type !== 'sentenceCompletion';

    const game = () => {
      return <div>
        <div >
          <h4 style={{fontSize:'1.2em',padding:'10px 0px 0px 10px',height:'0px'}}>{this.state.name}</h4>

          <SpeedyContainer display={this.state.isSpeedy}>
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
                <p style={{fontSize:'3em',height:'0px',lineHeight:'0px'}}>{this.state.score}</p>
              </div>
              :
              <ProgressBar width={progress} checkpoints={this.state.checkpoints || []} />
            }
          </div>
        </div>
        <div style={{width:'85%',margin:'0 auto',textAlign:'center'}}>
          {this.state.question && !displayOnCorrect && question()}
          {this.state.question && <OnCorrectImage word={this.state.question.word} display={displayOnCorrect} />}
        </div>
        {directions()}
        <NextButtonContainer display={this.state.isInterlude} onClick={() => this.nextQuestion()}>
          <img src={nextButton} alt='next-Button' style={{height:'50px',width:'auto'}} />
        </NextButtonContainer>
      </div>
    }

    return (
      <div>
        {this.state.gameOver ? gameOver() : game()}
      </div>
    );
  }
}

const SpeedyContainer = styled.div`
  display: ${props => props.display ? 'flex' : 'none'};
  justify-content: space-evenly;
  align-items: center;
  width: 150px;
  height: 35px;
  float: right;
  margin: -10px 10px 0px 0px;
`

const NextButtonContainer = styled.div`
  display: ${props => props.display ? 'flex' : 'none'};
  position: absolute;
  right: 25px;
  cursor: pointer;
  bottom: 20px;
  &:hover {
    opacity: 0.8;
  }
`
const Text = styled.p`
  width: 80%;
  margin-left: 10%;
  line-height: 40px;
  font-size: 1.5em;
  color: ${color.darkGray};
  @media (max-width: 1100px) {
    line-height: 30px;
    text-align: left !important;
    font-size: 1.2em;
  }
  @media (max-width: 450px) {
    font-size: 0.9em;
  }
`

const mapStateToProps = (state, ownProps) => {
  const {
    entities: { words }
  } = state

  return {
    words: _.values(words)
  }
}

export default connect(mapStateToProps, { loadWords })(Game)
