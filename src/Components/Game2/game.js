import queryString from 'query-string';
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import moment from 'moment';
import styled from 'styled-components';
import _ from 'underscore';
import get from 'lodash/get'
import { Link } from 'react-router-dom';

import Header from '../Header/index';
import { color } from '../../Library/Styles/index';
import { shouldRedirect } from '../../Library/helpers';
import LoadingSpinner from '../Common/loadingSpinner';

import SpeedRound from './speedRound';
import ProgressBar from './progressBar';
import { alerts } from './alerts';
import OnCorrectImage from './onCorrectImage';

import {
  HelpButton, HeaderContainer, ButtonValue, ButtonContent, Bottom, Content, PromptContainer,
  Prompt, PromptValue, Answer, AnswerSpace, Underline, AnswerValue,
  Choices, ChoiceButton, ExitOut, StageDot, Alert, ButtonHint
} from './components'

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      time: 5,
      questionIndex: 0,
      hintCount: 0,
      guessed: {},
      prompt: 'normal',
      points: 0,
      correct: true,
      correctCounter: [0,0],
      questionStartTime: moment()
    }

    this.handleKeydown = this.handleKeydown.bind(this);
  }

  componentDidMount() {
    document.body.addEventListener('keydown', this.handleKeydown);
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.handleKeydown);
  }

  handleKeydown(e) {
    if (!this.state.question) { return; }

    if (e.key === 'Enter' && this.state.questionComplete) {
      clearTimeout(this.continue);
      this.reset(() => this.setQuestion());
    } else {
      const choices = this.state.question.choices;
      const index = _.findIndex(choices, c => c.value.toLowerCase() === e.key.toLowerCase());

      if (this.state.isSpellQuestion && index > -1) {
        e.preventDefault();      
        this.guessed(choices[index].value, index);
      }
    }
  }  

  componentWillReceiveProps(nextProps) {
    const questions = nextProps.questions;

    if (questions && !this.state.questions) { 
      const gameStartTime = moment();
      this.setState({ questions: questions, gameStartTime: gameStartTime }, this.setQuestion); 
    }
  }

  setQuestion() {
    const question = this.state.questions[this.state.questionIndex];
    
    if (question) {
      console.log(question)
      const isSpellQuestion = _.every(question.answer, a => a.value.length === 1);
      this.setState({ question: question, isSpellQuestion: isSpellQuestion }, this.checkHint);
      setTimeout(this.autohint.bind(this), 2000);
    } else {
      const accuracy = this.state.correctCounter[0] / Math.max(this.state.correctCounter[1], 1);
      const score = this.state.points;
      const time = Math.floor(moment.duration(moment().diff(this.state.gameStartTime)).asSeconds());
      this.props.gameOver(accuracy, score, time);
    }
  }

  guessed(choice, idx) {
    let correct

    const answer = _.map(this.state.question.answer, a => {
      if (correct) { return a; }
      const correctGuess = a.missing && a.value === choice;
      if (correctGuess) { correct = true; }
      return correctGuess ? { value: choice, missing: false } : a;
    });

    this.animateButton(choice, idx, correct);

    if (correct) {
      this.setState({ question: _.extend(this.state.question, {}, { answer: answer }) }, this.checkComplete);
    } else {
      this.setState({ correct: false });
    }
  }

  animateButton(choice, idx, correct) {
    this.setState({ guessed: { idx: idx, correct: correct }}, () => {
      setTimeout(() => this.setState({ guessed: {} }), 300);
    })
  }

  animateAlerts() {
    if (this.state.isSpeedy) {
      this.setState({ alert: 'speedy' });
      setTimeout(() => { this.setState({ alert: undefined }); }, 750);
    };
    const correctAlert = this.state.correct ? 'correct' : 'passed';
    setTimeout(() => { this.setState({ alert: correctAlert }); }, this.state.isSpeedy ? 1000 : 0);
    setTimeout(() => { this.setState({ alert: undefined }); }, this.state.isSpeedy ? 1500 : 750);    
  }

  checkComplete() {
    if (_.every(this.state.question.answer, a => !a.missing)) {
      const isSpeedy = Math.floor(moment.duration(moment().diff(this.state.questionStartTime)).asSeconds()) < 5;
      this.setState({
        questionComplete: true,
        isSpeedy: isSpeedy,
        points: this.state.points + 1,
        correctCounter: [this.state.correctCounter[0] + (this.state.correct ? 1 : 0), this.state.correctCounter[1] + 1],
        questionIndex: this.state.questionIndex + 1
       }, () => {
        this.animateAlerts();
        this.continue = setTimeout(() => { this.reset(() => this.setQuestion()) }, 100000);
      })
    }
  }

  reset(cb) {
    this.setState({ gameOpaqueness: 0 }, () => {
      setTimeout(() => {
        this.setState({
          questionComplete: false,
          hintCount: 0,
          highlightPrompt: false,
          prompt: 'normal',
          hintButtonsOn: false,
          correct: true,
          questionStartTime: moment(),
          gameOpaqueness: 1
        }, cb);
      }, 200);
    });
  }

  glowAnswer(giveAnswer) {
    const q = this.state.question;
    const nextCorrect = _.find(q.answer, a => a.missing);
    if (!nextCorrect) { return; }
    const idx = _.findIndex(q.choices, c => c.value === nextCorrect.value);  
    this.setState({ glowIdx: idx });
    if (giveAnswer) { this.guessed(q.choices[idx].value, idx); }
    setTimeout(() => this.setState({ glowIdx: -1 }), 200);
  }

  autohint() {
    switch (this.state.question.type) {
      case 'defToOneRoot': 
      case 'defToAllRoots': 
      case 'defCompletion':
      case 'defToAllRootsNoHighlight':
        this.setState({ hintButtonsOn: true });
        break;
      case 'defToWord': case 'defToCharsOneRoot':
        this.setState({ highlightPrompt: true });
        break;
      default:
        break;
    }
  }  

  checkHint() {
    const {
      hintCount,
      question
    } = this.state

    switch (question.type) {

    case 'defToOneRoot': case 'defToAllRoots':
      hintCount === 0
        ? this.setState({ highlightPrompt: true })
        : this.glowAnswer(false);
      break;
    
    case 'defCompletion':
      hintCount !== 0 && this.glowAnswer(false);
      break;

    case 'defToAllRootsNoHighlight':
      hintCount === 1
        ? this.setState({ highlightPrompt: true })
        : hintCount > 1 && this.glowAnswer(false);
      break;

    case 'defToWord':
      hintCount === 1
        ? this.setState({ prompt: 'easy' })
        : hintCount > 1 && this.glowAnswer(false);
      break;

    case 'defToCharsOneRoot':
      hintCount === 1
        ? this.setState({ prompt: 'easy' })
        : hintCount > 1 && this.glowAnswer(true);
      break;
    }
  }

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }  

    const {
      guessed,
      highlightPrompt,
      hintButtonsOn,
      hintCount,
      isSpellQuestion,
      points,
      questionComplete,
      questionIndex,
      question,
      questions,
      time,
      glowIdx
    } = this.state;

    const progressComponent = type => {
      switch (type) {
        case 'train': case 'explore': case 'read':
          return <ProgressBar
            progress={Math.max(questionIndex) / get(questions, 'length', 1)} />;
        case 'speed':
          return <SpeedRound
            time={time}
            score={points}
            gameOver={this.gameOver.bind(this)} />;
        default:
          return;
      }
    }

    const alert = type => {
      return  <Alert hide={_.isUndefined(type)} display={this.state.questionComplete ? '' : 'none'}>
        <img
          style={{height:'75%',width:'auto',marginRight:'10px'}}
          src={type && alerts[type].image} />              
        <p style={{color:type && alerts[type].color,fontSize:'1.1em'}}>
          {type && alerts[type].name.toUpperCase()}
        </p>
      </Alert>      
    }

    const topInfo = (() => {
      return <div style={{height:'10%',width:'100%'}}>
        <Link to={'/home'}>
          <ExitOut
            src={require('../../Library/Images/exit-gray.png')} />
        </Link>
        {progressComponent(this.props.type)}
        {alert(this.state.alert)}
      </div>
    })();

    const promptText = () => {
      const prompt = question.prompt[this.state.prompt] || question.prompt['normal']
      return _.map(prompt, (section, i) => {
        const highlight = highlightPrompt && section.highlight;
        const style = highlight
          ? { color: color.warmYellow, textTransform: 'uppercase', fontFamily: 'BrandonGrotesqueBold' }
          : {};
        return <span key={i} style={style}>{section.value}</span>;
      });
    }

    const prompt = () => {
      return <PromptContainer>
        <Prompt>
          <PromptValue>
            {promptText()}
          </PromptValue>
        </Prompt>
      </PromptContainer>
    };

    const answer = () => <Answer>{_.map(question.answer, (a, idx) => answerSpace(a.value, a.missing, idx))}</Answer>

    const answerSpace = (value, missing, idx) => {
      const width = `${value.length * 30}px`;
      const margin = questionComplete
        ? `0px -${this.state.isSpellQuestion ? 2 : 5}px`
        : `0px ${this.state.isSpellQuestion ? 5 : 10}px`;
      return <AnswerSpace key={idx} width={width} margin={margin}>
        <AnswerValue missing={missing}>
          {value}
        </AnswerValue>
        <Underline
          color={questionComplete ? color.warmYellow : missing ? 'black' : color.green}/>
      </AnswerSpace> 
    }

    const choiceButton = (choice, idx, count) => {
      const { value, hint } = choice;
      const bColor = guessed.idx === idx
      ? (guessed.correct ? color.green : color.red)
      : glowIdx === idx ? color.green : color.blue;
      return <ChoiceButton
        square={isSpellQuestion}
        long={count === 4}
        key={idx}
        bColor={bColor}
        onClick={() => this.guessed(value, idx)}>
        <ButtonContent>
          <ButtonValue hintOn={hintButtonsOn}>
            {value}
          </ButtonValue>
          <ButtonHint opacity={hintButtonsOn ? 1 : 0}>
            {hint}
          </ButtonHint>
        </ButtonContent>
      </ChoiceButton> 
    }


    const gridTemplates = (count, isSpellQuestion) => {
      // todo: validate choice lengths (12 / 16 for spell / 4 - 10 even for regular)
      const gridStr = c => _.map(Array(c).fill(100/c), perc => `${perc}%`).join(' ');
      const twoByX = { column: gridStr(count/2), row: gridStr(2) };
      const xByOne = { column: gridStr(1), row: gridStr(count) };

      return isSpellQuestion
      ? {  mobile: { column: gridStr(count === 16 ? 4 : 3), row: gridStr(count === 16 ? 4 : 3) }, regular: twoByX }
      : count === 4
        ? { mobile: xByOne, regular: xByOne }
        : { mobile: { column: twoByX.row, row: twoByX.column }, regular: twoByX };
    }

    const choices = () => {
      const grids = gridTemplates(question.choices.length, isSpellQuestion)
      return <Choices grid={grids.regular} mobileGrid={grids.mobile}>
        {_.map(question.choices, (c, idx) => choiceButton(c, idx, question.choices.length))}
      </Choices>
    };

    const interlude = (() => {
      return <div style={{height:'50%',width:'80%',margin:'0 auto',display:!questionComplete ? 'none' : ''}}>
        <OnCorrectImage
          display={questionComplete}
          word={get(question, 'word')} />
      </div>
    })();    

    const questionComponents = (() => {
      if (question) {
        return <div style={{height:'80%',width:'100%'}}>
          {prompt()}
          {answer()}
          {!questionComplete && choices()}
          {interlude}
        </div>
      }
    })();

    const levelInfo = () => {
      return <div>
        <p style={{fontFamily:'BrandonGrotesqueBold',fontSize:'1.25em',height:'2px'}}>
          {this.props.level.fullname}
        </p>
        {_.map(_.range(1, this.props.level.progress[1] + 1), n => {
          return <StageDot key={n} green={n <= this.props.level.progress[0]} />
        })}
      </div>      
    }

    const helpButton = (() => {
      return <HelpButton color={questionComplete ? color.green : color.red}
          onClick={() => {
            if (questionComplete) {
              clearTimeout(this.continue);
              this.reset(() => this.setQuestion());
            } else {
              this.setState({ hintCount: hintCount + 1 }, this.checkHint);
            }
          }}>
          <p>
            {questionComplete ? 'CONTINUE' : 'HINT'}
            <span style={{fontSize:'0.6em',display:questionComplete ? 'block' : 'none'}}>
              (ENTER)
            </span>            
          </p>
      </HelpButton>
    })();

    const bottomInfo = (() => {
      return <Bottom>
        {this.props.level && levelInfo()}
        {helpButton}
      </Bottom>
    })();       

    const loadingSpinner = (() => {
      return 
    })();

    return (
      <div>
        {
          this.state.questions
          ?
          <Content opacity={this.state.gameOpaqueness}>
            {topInfo}
            {questionComponents}
            {bottomInfo}
          </Content>
          :
          <LoadingSpinner />
        }
      </div>
    );
  }
}

export default Game
