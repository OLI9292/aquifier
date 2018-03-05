import React, { Component } from 'react';
import { Redirect } from 'react-router';
import moment from 'moment';
import _ from 'underscore';
import get from 'lodash/get'
import { Link } from 'react-router-dom';

import { color } from '../../Library/Styles/index';
import { shouldRedirect } from '../../Library/helpers';
import LoadingSpinner from '../Common/loadingSpinner';

import hintChecker from './hintChecker';
import SpeedRound from './speedRound';
import ProgressBar from './progressBar';
import { alerts } from './alerts';
import OnCorrectImage from './onCorrectImage';

import {
  Alert, AlertImage, AlertText,
  Answer, AnswerSpace, AnswerValue, Underline,
  Bottom,
  ButtonContent, ButtonHint, ButtonValue,
  Content,
  Choices, ChoiceButton,
  ExitOut,
  HelpButton, HelpSpan,
  Pause,
  Prompt, PromptContainer, PromptValue,
  StageDot
} from './components'

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questionIndex: 0,
      hintCount: 0,
      guessed: {},
      prompt: 'normal',
      points: 0,
      incorrectGuesses: 0,
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
      const isSpellQuestion = _.every(question.answer, a => a.value.length === 1);
      this.setState({ question: question, isSpellQuestion: isSpellQuestion }, this.checkHint);
      setTimeout(this.autohint.bind(this), 2500);
    } else {
      // Reset questions in multiplayer and speed rounds
      if (_.contains(['multiplayer','speed'], this.props.type)) {
        const questions = this.props.originalQuestions;
        const questionIndex = 0;
        this.setState({ questions: questions, questionIndex: questionIndex }, this.setQuestion);
      } else {
        this.gameOver();        
      }
    }
  }

  gameOver() {
    const accuracy = this.state.correctCounter[0] / Math.max(this.state.correctCounter[1], 1);
    const score = this.state.points;
    const time = Math.floor(moment.duration(moment().diff(this.state.gameStartTime)).asSeconds());
    this.props.gameOver(accuracy, score, time);
  }

  guessed(choice, idx) {
    let correct

    const answer = _.map(this.state.question.answer, a => {
      if (correct) { return a; }
      const correctGuess = a.missing && a.value.toLowerCase() === choice.toLowerCase();
      if (correctGuess) { correct = true; }
      return correctGuess ? { value: choice, missing: false } : a;
    });

    this.animateButton(choice, idx, correct);

    if (correct) {
      this.setState({ question: _.extend({}, this.state.question, {}, { answer: answer }) }, this.checkComplete);
    } else {
      this.setState({ incorrectGuesses: this.state.incorrectGuesses + 1 });
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
      //setTimeout(() => { this.setState({ alert: undefined }); }, 1100);
    };
    const correctAlert = this.state.incorrectGuesses > 0 ? 'correct' : 'passed';
    //setTimeout(() => { this.setState({ alert: correctAlert }); }, this.state.isSpeedy ? 1200 : 0);
    //setTimeout(() => { this.setState({ alert: undefined }); }, this.state.isSpeedy ? 2300 : 1100);    
  }

  checkComplete() {
    const {
      correctCounter,
      hintCount,
      incorrectGuesses,
      question,
      questionIndex,
      questionStartTime,
      points
    } = this.state;

    const isComplete = _.every(question.answer, a => !a.missing);
    if (!isComplete) { return; }

    const correct = incorrectGuesses === 0 && hintCount === 0;
    const seconds = Math.ceil(moment.duration(moment().diff(questionStartTime)).asSeconds());
    const isSpeedy = seconds < 5;

    this.setState({
      questionComplete: true,
      isSpeedy: isSpeedy,
      points: points + 1,
      correctCounter: [correctCounter[0] + (correct ? 1 : 0), correctCounter[1] + 1],
      questionIndex: questionIndex + 1
     }, () => {
      this.props.recordQuestion(question, correct, seconds, this.state);        
      this.animateAlerts();
      this.continue = setTimeout(() => { this.reset(() => this.setQuestion()) }, 100000);
    });
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
      case 'defToWord': case 'defToCharsOneRoot': case 'defToCharsAllRoots': case 'rootInWordToDef':
        this.setState({ highlightPrompt: true });
        break;
      default:
        break;
    }
  }  

  checkHint() {
    const hint = hintChecker(this.state.hintCount, this.state.question.type);
    switch (hint) {
      case 'highlightPrompt': this.setState({ highlightPrompt: true }); break;
      case 'easyPrompt':      this.setState({ prompt: 'easy' }); break;
      case 'hintButtonsOn':   this.setState({ hintButtonsOn: true }); break;
      case 'glowAnswer':      this.glowAnswer(false); break;
      case 'giveAnswer':      this.glowAnswer(true); break;
      default: break;
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
      glowIdx
    } = this.state;

    const progressComponent = type => {
      switch (type) {
        case 'train': case 'explore': case 'demo':
          return <ProgressBar
            progress={Math.max(questionIndex) / get(questions, 'length', 1)} />;
        case 'speed': case 'multiplayer':
          return <SpeedRound
            time={this.props.time}
            end={this.props.end}
            score={points}
            gameOver={this.gameOver.bind(this)} />;
        default:
          return;
      }
    }

    const alert = type => {
      return  <Alert hide={_.isUndefined(type)} display={this.state.questionComplete ? '' : 'none'}>
        <AlertImage src={type && alerts[type].image} />              
        <AlertText color={type && alerts[type].color}>
          {type && alerts[type].name.toUpperCase()}
        </AlertText>
      </Alert>      
    }

    const topInfo = (() => {
      return <div style={{height:'10%',width:'100%',display:'flex',alignItems:'center'}}>
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
        if (section.value === '<br />') { return <br />; }
        const highlight = highlightPrompt && section.highlight;
        const style = highlight ? { color: color.warmYellow, fontFamily: 'BrandonGrotesqueBold' } : {};
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
      const margin = questionComplete
        ? '0px 0px'
        : `0px ${this.state.isSpellQuestion ? 5 : 10}px`;

      return <AnswerSpace key={idx} margin={margin}>
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
      const fontSize = value.length > 14 ? '0.65em' : value.length > 10 ? '0.75em' : '0.85em';
      const hintFontSize = get(hint, 'length') > 12 ? '0.65em' : '0.75em';
      return <ChoiceButton
        square={isSpellQuestion}
        long={count === 4}
        key={idx}
        bColor={bColor}
        onClick={() => this.guessed(value, idx) }>
        <ButtonContent>
          <ButtonValue fontSize={fontSize} marginTop={hintButtonsOn || !hint}>
            {value}
          </ButtonValue>
          <ButtonHint fontSize={hintFontSize} opacity={hintButtonsOn ? 1 : 0}>
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
      ? {  mobile: { column: gridStr(count === 16 ? 4 : 4), row: gridStr(count === 16 ? 4 : 3) }, regular: twoByX }
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

    const levelInfo = (() => {
      return <div style={{display:'flex',flexDirection:'column'}}>
        <p style={{fontFamily:'BrandonGrotesqueBold',fontSize:'1.25em',margin:'0px 0px -5px 0px'}}>
          {get(this.props.level, 'fullname')}
        </p>
        <div>
          {_.has(this.props.level, 'progress') && _.map(_.range(1, this.props.level.progress[1] + 1), n => {
            return <StageDot key={n} green={n <= this.props.level.progress[0]} />
          })}
        </div>
      </div>      
    })();

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
            {questionComplete ? 'Continue' : 'Hint'}
            <HelpSpan hide={questionComplete}>
              (enter)
            </HelpSpan>            
          </p>
      </HelpButton>
    })();

    const bottomInfo = (() => {
      return <Bottom>
        {levelInfo}
        {helpButton}
      </Bottom>
    })();      

    return (
      <div>
        {
          this.props.pauseMatch
          ?
          <Pause>
            Waiting for admin to start game.
          </Pause>
          :
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
