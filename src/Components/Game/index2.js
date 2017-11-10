import axios from 'axios';
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';

import SentenceCompletionQuestion from './Questions/sentenceCompletion';
import ButtonQuestion from './Questions/button';
import SpellQuestion from './Questions/spell';
import ProgressBar from '../ProgressBar/index';

import Word from '../../Models/Word';
import Root from '../../Models/Root';
import Lesson from '../../Models/Lesson';

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nextQuestionIndex: 4,
      question: null,
      questions: []
    }
  }

  async componentDidMount() {
    axios.all([Word.fetch(), Root.fetch()])
      .then(axios.spread((res1, res2) => {
        this.setState({ words: res1.data.words, roots: res2.data.roots }, this.setupGame);
      }))
      .catch((err) => console.log(err))
  }

  setupGame() {
    if (this.props.settings.lesson) {
      this.setupLesson(this.props.settings.lesson);
    }
  }  

  setupLesson = async (id) => {
    const result = await Lesson.fetch(id);
    const data = result.data.questions || [];
    const [questions, checkpoints] = this.lessonStages(data);
    this.setState({
      name: result.data.name,
      questions: questions,
      checkpoints: checkpoints
    }, this.nextQuestion);
  }

  lessonStages(data) {
    const stage1 = _.shuffle(data.map((q) => ({ word: q.word, type: 'button' })));
    const stage2 = data.map((q) => ({ word: q.word, context: q.context, type: 'sentenceCompletion' }));
    const stage3 = _.flatten(data.map((q) => _.shuffle(_.union(q.related, [q.word]).map((w) => ({ word: w, type: 'button' })))));
    const questions = _.flatten([stage1, stage2, stage3]);
    const checkpoints = [stage1.length / questions.length, (stage1.length + stage2.length) / questions.length, 1]
    return [questions, checkpoints];
  }

  nextQuestion() {
    const questionIndex = this.state.nextQuestionIndex;

    if (questionIndex >= this.state.questions.length) {
      this.setState({ gameOver: true });
    } else {
      const question = this.state.questions[questionIndex];
      const word = _.find(this.state.words, (w) => w.value === question.word);
      if (word) {
        question.word = word;
        this.setState({ question: question, nextQuestionIndex: questionIndex + 1 });
      } else {
        this.setState({ nextQuestionIndex: questionIndex + 1 }, this.nextQuestion);
      }
    }
  }

  render() {
    if (this.state.redirect && !window.location.href.endsWith(this.state.redirect)) {
      return <Redirect push to={this.state.redirect} />;
    }

    const progress = this.state.nextQuestionIndex / this.state.questions.length || 0;    

    const question = () => {
      switch(this.state.question.type) {
        case 'button':
          return <ButtonQuestion 
            word={this.state.question.word} 
            nextQuestion={this.nextQuestion.bind(this)} 
            words={this.state.words} 
            roots={this.state.roots} />
          break
        case 'sentenceCompletion':
          return <SentenceCompletionQuestion
            question={this.state.question}
            nextQuestion={this.nextQuestion.bind(this)}
            words={this.state.words}
            roots={this.state.roots} />
        default:
          break
      }
    }

    return (
      <div>
        <h4 style={{width:'25%',marginTop:'-20px',fontSize:'1.2em'}}>{this.state.name}</h4>
        <div style={{width:'50%',margin:'0 auto'}}>
          <ProgressBar width={progress} checkpoints={this.state.checkpoints || []} />
        </div>        
        {this.state.question && question()}
      </div>
    );
  }
}

const Layout = styled.div`
`

export default Game;
