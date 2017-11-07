import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';

import Button from '../Common/button';
import { color } from '../../Library/Styles/index';
import { sleep, toUnderscore } from '../../Library/helpers';
import questionMark from '../../Library/Images/question-mark-white.png';
import LessonModel from '../../Models/Lesson';
import ProgressBar from '../ProgressBar/index';
import Firebase from '../../Networking/Firebase';

class Lesson extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nextIndex: 0,
      correct: null,
      context: null,
      dataLoaded: false,
      gameOver: false,
      hintCount: 0,
      questions: [],
      name: '',
      options: [],
      words: []
    }
  }

  async componentDidMount() {
    const result = await LessonModel.fetch(this.props.id);
    if (result.data) {
      const questions = result.data.questions;
      const words = await Firebase.fetchWords();
      this.setState({ questions: questions, words: words, name: result.data.name, dataLoaded: true }, this.nextQuestion);
    }
  }

  options(correct) {
    return _.shuffle(_.union(_.sample(this.state.words, 8)
      .map((w) => w.value.toLowerCase())
      .filter((w) => w !== correct).slice(0,5), [correct]));
  }

  nextQuestion() {
    const idx = this.state.nextIndex;
    if (idx >= this.state.questions.length) {
      this.setState({ gameOver: true });
    } else {
      const next = this.state.questions[idx];
      const correct = this.state.words.find((w) => w.value === next.word);
      if (correct) {
        const context = next.context.replace(correct.value, toUnderscore(correct.value));
        const options = this.options(correct.value);
        this.setState({ correct: correct, context: context, options: options, nextIndex: idx + 1, hintCount: 0 }); 
      } else {
        this.setState({ nextIndex: idx + 1 }, this.nextQuestion);
      }
    }
  }

  correct = async () => {
    const context = this.state.context.replace(toUnderscore(this.state.correct.value), this.state.correct.value);
    this.setState({ context: context, hintCount: 0 });
    await sleep(1000);
    this.nextQuestion();
  }

  handleGuess = async (option) => {
    const correct = option === this.state.correct.value;
    if (correct) {
      this.correct();
    } else {
      this.setState({ incorrect: option });
      await sleep(200);
      this.setState({ incorrect: null });
    }
  }

  formattedDefinition(showRoots) {
    return this.state.correct.definition.map((d,i) => {
      const c = d.isRoot ? color.yellow : color.gray;
      let value = d.isRoot ? d.value.toUpperCase() : d.value;
      if (showRoots && d.isRoot) {
        const rootComponent = _.find(this.state.correct.components, (c) => c.definition === d.value);
        if (rootComponent) { value += ` (${rootComponent.value.toUpperCase()})` };
      }
      return <span key={i} style={{color:c,textDecoration:'underline'}}>{value}</span>
    })
  }

  render() {
    if (this.state.redirect && !window.location.href.endsWith(this.state.redirect)) {
      return <Redirect push to={this.state.redirect} />;
    }

    const buttons = () => {
      return <ButtonsContainer>
        {this.state.options.map((o,i) => {
          const incorrect = this.state.incorrect === o;
          return <GameButton key={i} onClick={() => this.handleGuess(o)} incorrect={incorrect}>{o}</GameButton>;
        })}
      </ButtonsContainer>
    }

    const prompt = () => {
      const context = this.state.context;
      if (this.state.hintCount === 0) {
        return <Prompt>{context}</Prompt>;
      } else {
        const showRoots = this.state.hintCount > 1;
        const split = context.split(toUnderscore(this.state.correct.value));
        return <Prompt>{_.flatten([split[0], this.formattedDefinition(showRoots), split[1]])}</Prompt>;
      }
    }

    const lesson = () => {
      return <div>
        <div style={{width:'50%',margin:'0 auto'}}>
          <ProgressBar width={this.state.nextIndex / this.state.questions.length} />
        </div>
        <h4 style={{width:'25%',marginTop:'-20px',fontSize:'1.2em'}}>{this.state.name}</h4>
        {prompt()}
        {buttons()}
        <QuestionMark onClick={() => this.setState({ hintCount: this.state.hintCount + 1 })}>
          <img style={{width:'100%'}} src={questionMark} />
        </QuestionMark>      
      </div>
    }

    const gameOver = () => {
      return <div>
        <p style={{textAlign:'center',width:'100%'}}>{`Congragulations! You've completed ${this.state.name}.`}</p>
      </div>
    }

    return (
      <Layout hide={!this.state.dataLoaded}>
        {this.state.gameOver ? gameOver() : lesson()}
      </Layout>
    );
  }
}

const GameButton = Button.large.extend`
  margin: 5px;
  background-color: ${props => props.incorrect ? color.red : color.blue};
  &:hover {
    background-color: ${props => props.incorrect ? color.red : color.blue10l};
  }
`

const Layout = styled.div`
  width: 90%;
  visibility: ${props => props.hide ? 'hidden' : ''};
  margin: 0 auto;
  padding-top: 50px;
`
const Prompt = styled.p`
  font-size: 1.4em;
  line-height: 35px;
`

const ButtonsContainer = styled.div`
  flex-wrap: wrap;
  justify-content: center;
`

const QuestionMark = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 5px;
  background-color: ${color.yellow};
  &:hover {
    background-color: ${color.yellow10l};
  }  
  cursor: pointer;
  float: right;
  margin-top: 50px;
`

export default Lesson;
