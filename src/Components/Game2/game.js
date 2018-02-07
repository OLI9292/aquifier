import queryString from 'query-string';
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';
import get from 'lodash/get'
import { Link } from 'react-router-dom';

import Header from '../Header/index';
import { color } from '../../Library/Styles/index';
import { shouldRedirect } from '../../Library/helpers';

import SpeedRound from './speedRound';
import ProgressBar from './progressBar';
import OnCorrectImage from './onCorrectImage';

import {
  HelpButton, HeaderContainer, ButtonValue, Bottom, Content, PromptContainer,
  Prompt, PromptValue, Answer, AnswerSpace, Underline, AnswerValue,
  Choices, ChoiceButton, ExitOut
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
      points: 0
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
    const choices = this.state.question.choices;
    const index = _.findIndex(choices, c => c.value === e.key);

    if (this.state.isSpellQuestion && index > -1) {
      e.preventDefault();      
      this.guessed(choices[index].value, index);
    }
  }  

  componentWillReceiveProps(nextProps) {
    const questions = nextProps.questions;
    if (questions && !this.state.questions) { this.setState({ questions }, this.setQuestion); }
  }

  setQuestion() {
    const question = this.state.questions[this.state.questionIndex];
    
    if (question) {
      console.log(question);
      const isSpellQuestion = _.every(question.answer, a => a.value.length === 1);
      this.setState({ question: question, isSpellQuestion: isSpellQuestion }, this.checkHint);
    } else {
      this.gameOver();
    }
  }

  guessed(choice, idx) {
    const answer = _.map(this.state.question.answer, a => {
      const correct = a.missing && a.value === choice;
      return correct ? { value: choice, missing: false } : a
    });

    const correct = !_.isEqual(this.state.question.answer, answer);
    this.animateButton(choice, idx, correct);

    if (correct) {
      this.setState({ question: _.extend(this.state.question, {}, { answer: answer }) }, this.checkComplete);
    }
  }

  animateButton(choice, idx, correct) {
    this.setState({ guessed: { idx: idx, correct: correct }}, () => {
      setTimeout(() => this.setState({ guessed: {} }), 300);
    })
  }

  checkComplete() {
    if (_.every(this.state.question.answer, a => !a.missing)) {
      this.setState({
        questionComplete: true,
        points: this.state.points + 1,
        questionIndex: this.state.questionIndex + 1
       }, () => {
        this.continue = setTimeout(() => { this.reset(() => this.setQuestion()) }, 100000);
      })
    }
  }

  reset(cb) {
    this.setState({
      questionComplete: false,
      hintCount: 0,
      highlightPrompt: false,
      prompt: 'normal',
      hintButtonsOn: false
    }, cb)
  }

  checkHint() {
    const {
      hintCount,
      question
    } = this.state

    switch (question.type) {

    case 'defToOneRoot': case 'defToAllRoots':
      switch (hintCount) {
      case 0: this.setState({ highlightPrompt: true }); break;
      case 1: this.setState({ prompt: 'easy' }); break;
      case 2: this.setState({ hintButtonsOn: true }); break;
      default: break;}
    
    case 'defCompletion':
      switch (hintCount) {
      case 1: this.setState({ highlightPrompt: true }); break;
      case 2: this.setState({ hintButtonsOn: true }); break;      
      default: break;}

    case 'defToAllRootsNoHighlight':
      switch (hintCount) {
      case 1: this.setState({ highlightPrompt: true }); break;
      case 2: this.setState({ prompt: 'easy' }); break;
      case 3: this.setState({ hintButtonsOn: true }); break;
      default: break;} 

    case 'defToWord':
      switch (hintCount) {
      case 1: this.setState({ highlightPrompt: true }); break;
      case 2: this.setState({ prompt: 'easy' }); break;
      default: break;} 

    case 'defToCharsOneRoot':
      switch (hintCount) {
      case 1: this.setState({ highlightPrompt: true }); break;
      case 2: this.setState({ prompt: 'easy' }); break;
      default: break;}  
    }
  }

  gameOver() {
    // this.setState({ redirect: '/home' });
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
      time
    } = this.state;

    const progressComponent = type => {
      switch (type) {
        case 'train': case 'demo':
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

    const topInfo = (() => {
      return <div style={{height:'10%',width:'100%'}}>
        <Link to={'/home'}>
          <ExitOut
            src={require('../../Library/Images/exit-gray.png')} />
        </Link>
        {progressComponent(this.props.type)}
      </div>
    })();

    const promptText = () => {
      const prompt = question.prompt[this.state.prompt] || question.prompt['normal']
      return _.map(prompt, (section, i) => {
        const highlight = highlightPrompt && section.highlight;
        const style = highlight ? { color: color.warmYellow, textTransform: 'uppercase' } : {};
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

    const answerSpace = (value, missing, idx) => {
      const width = `${value.length * 30}px`;
      const margin = questionComplete ? '0px -2px' : '0px 10px';
      return <AnswerSpace key={idx} width={width} margin={margin}>
        <AnswerValue missing={missing}>
          {value}
        </AnswerValue>
        <Underline color={missing ? 'black' : color.green}/>
      </AnswerSpace> 
    }

    const choiceButton = (choice, idx, count) => {
      const { value, hint } = choice;
      const bColor = guessed.idx === idx ? (guessed.correct ? color.green : color.red) : color.blue;

      return <ChoiceButton
        square={isSpellQuestion}
        long={count === 4}
        key={idx}
        bColor={bColor}
        onClick={() => this.guessed(value, idx)}>
        <ButtonValue>
          {value}
          <span style={{display:'block',fontSize:'0.75em'}}>
            {hintButtonsOn && hint}
          </span>
        </ButtonValue>
      </ChoiceButton> 
    }

    const answer = () => {
      return <Answer>
        {_.map(question.answer, (a, idx) => answerSpace(a.value, a.missing, idx))}
      </Answer>
    };

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

    const bottomInfo = (() => {
      return <Bottom>
        <p style={{fontFamily:'BrandonGrotesqueBold'}}>
          Speed Round 1
        </p>
        <HelpButton color={questionComplete ? color.green : color.red}
          onClick={() => {
            if (questionComplete) {
              clearTimeout(this.continue);
              this.reset(() => this.setQuestion());
            } else {
              this.setState({ hintCount: hintCount + 1 }, this.checkHint);
            }
          }}>
          {questionComplete ? 'CONTINUE' : 'HINT'}
        </HelpButton>
      </Bottom>
    })();       

    return (
      <div>
        <Content>
          {topInfo}
          {questionComponents}
          {bottomInfo}
        </Content>
      </div>
    );
  }
}

export default Game
