import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';

import Button from '../../Common/button';
import { color } from '../../../Library/Styles/index';
import { sleep, toUnderscore } from '../../../Library/helpers';
import questionMark from '../../../Library/Images/question-mark-white.png';

class SentenceCompletion extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
    this.reset(this.props.question);
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.question, this.props.question)) {
      this.reset(nextProps.question);
    }
  }

  reset(question) {
    const word = question.word;
    let context = question.context; 
    context = context.replace(word.value, toUnderscore(word.value));
    const options = this.options(word.value);
    this.setState({ correct: word, context: context, options: options, hintCount: 0, ready: true }); 
  }

  correct = async () => {
    const context = this.state.context.replace(toUnderscore(this.state.correct.value), this.state.correct.value);
    this.setState({ context: context, hintCount: 0 });
    await sleep(1000);
    this.props.nextQuestion();
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

  options(correct) {
    return _.shuffle(_.union(_.sample(this.props.words, 8)
      .map((w) => w.value.toLowerCase())
      .filter((w) => w !== correct).slice(0,5), [correct]));
  }    

  render() {
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

    const question = () => {
      return <div>
        {prompt()}
        {buttons()}
        <QuestionMark onClick={() => this.setState({ hintCount: this.state.hintCount + 1 })}>
          <img style={{width:'100%'}} src={questionMark} />
        </QuestionMark>      
      </div>
    }    

    return (
      <div>
        {this.state.ready && question()}
      </div>
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

export default SentenceCompletion;
