import React, { Component } from 'react';
import { Redirect } from 'react-router';
import moment from 'moment';
import _ from 'underscore';
import get from 'lodash/get'
import { Link } from 'react-router-dom';

import { color } from '../../Library/Styles/index';
import { caseInsEq, shouldRedirect, mobileCheck } from '../../Library/helpers';
import LoadingSpinner from '../Common/loadingSpinner';

import exitPng from '../../Library/Images/exit-gray.png';

import hintChecker from './hintChecker';
import SpeedRound from './speedRound';
import ProgressBar from './progressBar';
import Alert from './alert';
import Interlude from './Interlude/index';

import {
  Answer, AnswerSpace, AnswerValue, Underline,
  Bottom,
  ButtonContent, ButtonHint, ButtonValue,
  Content,
  Choices, ChoiceButton,
  ExitOut,
  HelpButton, HelpSpan,
  Pause,
  Prompt, PromptContainer, PromptValue,
  StageDot,
  Top
} from './components';

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questionIndex: 0,
      hintCount: 0,
      guessed: {},
      prompt: 'normal',
      incorrectGuesses: 0,
      correctCounter: [0,0],
      questionStartTime: moment()
    };

    this.handleKeydown = this.handleKeydown.bind(this);
  }

  componentDidMount() {
    this.setState({ mobile: mobileCheck() });    
    document.body.addEventListener('keydown', this.handleKeydown);
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.handleKeydown);
  }

  handleKeydown(e) {
    if (!this.state.question) { return; }

    if (e.key === 'Enter' && this.state.questionComplete) {
      this.reset(() => this.setQuestion());
    } else {
      const choices = this.state.question.choices;
      const index = _.findIndex(choices, c => caseInsEq(c.value, e.key));

      if (this.state.isSpellQuestion && index > -1) {
        e.preventDefault();      
        this.guessed(choices[index].value, index);
      }
    }
  }  

  componentWillReceiveProps(nextProps) {
    if (!nextProps.questions || this.state.questions) { return; }
    this.setState({
      questions: nextProps.questions,
      gameStartTime: moment()
    }, this.setQuestion);
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
    const { correctCounter, gameStartTime } = this.state;
    const accuracy = correctCounter[0] / Math.max(correctCounter[1], 1);
    const score = correctCounter[0];
    const time = Math.floor(moment.duration(moment().diff(gameStartTime)).asSeconds());
    this.setState({ gameOver: true }, () => this.props.gameOver(accuracy, score, time));
  }

  guessed(choice, idx) {
    let correct

    const answer = _.map(this.state.question.answer, a => {
      if (correct) { return a; }
      const correctGuess = a.missing && caseInsEq(a.value, choice);
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

  checkComplete() {
    const {
      correctCounter,
      factoidReady,
      question,
      questionIndex,
      questionStartTime,
      type
    } = this.state;

    const isComplete = _.every(question.answer, a => !a.missing);
    if (!isComplete) { return; }

    const correct = this.state.incorrectGuesses === 0 && this.state.hintCount === 0;
    const seconds = Math.ceil(moment.duration(moment().diff(questionStartTime)).asSeconds());
    const isSpeedy = seconds < 4;
    const nextQuestionIndex = questionIndex + (isSpeedy && _.contains(['train','explore'], type) ? 2 : 1);

    this.setState({
      questionComplete: true,
      isSpeedy: isSpeedy,
      correctCounter: [correctCounter[0] + (correct ? 1 : 0), correctCounter[1] + 1],
      questionIndex: nextQuestionIndex,
      alertTypes: { correct: correct, speedy: isSpeedy }
     }, () => {
      if (factoidReady) { this.hideContinue(); }
      this.props.recordQuestion(question, correct, seconds, this.state);        
    });
  }

  reset(cb) {
    this.setState({ gameOpaqueness: 0 }, () => {
      setTimeout(() => {
        this.setState({
          alertTypes: {},
          factoidReady: false,
          questionComplete: false,
          hintCount: 0,
          highlightPrompt: false,
          prompt: 'normal',
          hintButtonsOn: false,
          correct: true,
          questionStartTime: moment(),
          incorrectGuesses: 0,
          gameOpaqueness: 1
        }, cb);
      }, 200);
    });
  }

  glowAnswer(giveAnswer) {
    const q = this.state.question;
    const nextCorrect = _.find(q.answer, a => a.missing);
    if (!nextCorrect) { return; }
    const idx = _.findIndex(q.choices, c => caseInsEq(c.value, nextCorrect.value));  
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

  hideContinue() {
    this.setState({ hideContinue: true });
    setTimeout(() => this.setState({ hideContinue: false }), 2500);
  }

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }  

    const {
      alertTypes,
      correctCounter,
      factoidReady,
      gameOver,
      gameOpaqueness,
      guessed,
      hideContinue,
      highlightPrompt,
      hintButtonsOn,
      hintCount,
      isSpellQuestion,
      questionComplete,
      questionIndex,
      question,
      questions,
      glowIdx,
      mobile
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
            score={correctCounter[0]}
            gameOver={this.gameOver.bind(this)} />;
        default:
          return;
      }
    }

    const promptText = () => {
      const prompt = get(question.prompt, this.state.prompt || 'normal');
      return _.map(prompt, (section, i) => {
        if (section.value === '<br />') { return <br />; }
        const highlight = highlightPrompt && section.highlight;
        const style = highlight ? { color: color.warmYellow, fontFamily: 'BrandonGrotesqueBold' } : {};
        return <span key={i} style={style}>{section.value}</span>;
      });
    }

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

    const questionComponents = (() => {
      if (!question) { return; }

      const prompt = <PromptContainer>
        <Prompt>
          <PromptValue>
            {promptText()}
          </PromptValue>
        </Prompt>
      </PromptContainer>;

      const answer = <Answer>
        {_.map(question.answer, (a, idx) => answerSpace(a.value, a.missing, idx))}
      </Answer>;    

      const buttonGrids = gridTemplates(question.choices.length, isSpellQuestion);

      const choices = <Choices
        grid={buttonGrids.regular} 
        mobileGrid={buttonGrids.mobile}>
        {_.map(question.choices, (c, idx) => choiceButton(c, idx, question.choices.length))}
      </Choices>;

      const interlude = <Interlude
        factoidReady={() => this.setState({ factoidReady: true })}
        mobile={mobile}
        display={questionComplete}
        word={get(question, 'word')}
        level={get(question, 'level')}
        factoids={this.props.factoids} 
        imageKeys={this.props.imageKeys} />;

      const isDisplayingFactoid = questionComplete && factoidReady;

      const containerStyle = mobile && isDisplayingFactoid
        ? { minHeight: '80%', width:'100%', display: 'flex', alignItems: 'center' }
        : { height: '80%', width:'100%', textAlign: 'center' };

      return <div style={containerStyle}>
        {!isDisplayingFactoid && prompt}
        {!isDisplayingFactoid && answer}
        {!questionComplete && choices}
        {interlude}
      </div>;     
    })();

    const levelInfo = <div style={{display:'flex',flexDirection:'column'}}>
      <p style={{fontFamily:'BrandonGrotesqueBold',fontSize:'1.25em',margin:'0px 0px -5px 0px'}}>
        {get(this.props.level, 'fullname')}
      </p>
      <div>
        {_.has(this.props.level, 'progress') && _.map(_.range(1, this.props.level.progress[1] + 1), n => {
          return <StageDot key={n} green={n <= this.props.level.progress[0]} />
        })}
      </div>
    </div>;

    const helpButton = <HelpButton 
      hide={hideContinue}
      color={questionComplete ? color.green : color.red}
      onClick={() => questionComplete
        ? this.reset(() => this.setQuestion())
        : this.setState({ hintCount: hintCount + 1 }, this.checkHint)}>
      <p>
        {questionComplete ? 'Continue' : 'Hint'}
        <HelpSpan hide={questionComplete}>
          (enter)
        </HelpSpan>            
      </p>
    </HelpButton>;

    if (this.props.notYetStarted) {
      return <Pause>Waiting for admin to start game.</Pause>;      
    }

    if (!questions || gameOver) {
      return <LoadingSpinner />;
    }
    
    return (
      <Content opacity={gameOpaqueness}>
        <div style={{width:"100%",height:"100%"}}>
          <Top>
            <Link 
              to={'/home'}
              style={{height:mobile ? "35px" : "40px",width:mobile ? "35px" : "40px"}}>
              <ExitOut src={exitPng} />
            </Link>
            {progressComponent(this.props.type)}
            <Alert
              data={alertTypes} />
          </Top>

          {questionComponents}

          <Bottom>
            {levelInfo}
            {helpButton}
          </Bottom>
        </div>
      </Content>
    );
  }
}

export default Game
