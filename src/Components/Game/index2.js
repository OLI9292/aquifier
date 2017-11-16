import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';

import SentenceCompletionQuestion from './Questions/sentenceCompletion';
import ButtonQuestion from './Questions/button';
import SpellQuestion from './Questions/spell';
import OnCorrectImage from './onCorrectImage';
import ProgressBar from '../ProgressBar/index';

import WordList from '../../Models/WordList';
import Lesson from '../../Models/Lesson';
import { sleep } from '../../Library/helpers';
import { color, breakpoints } from '../../Library/Styles/index';

import leftArrow from '../../Library/Images/left-arrow.png';
import rightArrow from '../../Library/Images/right-arrow.png';
import enterKey from '../../Library/Images/enter.png';
import equalsKey from '../../Library/Images/equals.png';

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nextQuestionIndex: 0,
      question: null,
      questions: []
    }
  }

  async componentDidMount() {
    const words = JSON.parse(localStorage.getItem('words'));
    const roots = JSON.parse(localStorage.getItem('roots'));
    this.setState({ words: words, roots: roots }, this.setupGame);
  }

  setupGame() {
    if (this.props.settings.reading) {
      this.setupLesson(this.props.settings.reading);
    } else if (this.props.settings.wordList) {
      this.setupWordList(this.props.settings.wordList)
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

  setupWordList = async (id) => {
    const result = await WordList.fetch(id);
    if (result) {
      const wordList = result.data;
      const name = wordList.name;
      const questions = wordList.questions.map((q) => {
        const copy = q;
        q.type = this.difficultyFor(q.difficulty); 
        return copy 
      });

      this.setState({ 
        name: name,
        questions: questions
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

  runInterlude = async () => {
    this.setState({ isInterlude: true });
    await sleep(1500);
    this.setState({ isInterlude: false });
    return;
  }

  nextQuestion = async () => {
    this.state.question && await this.runInterlude();

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

  difficultyFor(integer) {
    return _.contains([0,1,2], integer) ? ['button', 'spellEasy', 'spellHard'][integer] : 'button';
  }

  render() {
    if (this.state.redirect && !window.location.href.endsWith(this.state.redirect)) {
      return <Redirect push to={this.state.redirect} />;
    }

    const progress = this.state.nextQuestionIndex / this.state.questions.length || 0;    

    const question = () => {
      const type = this.state.question.type;
      if (type === 'sentenceCompletion') {
        return <SentenceCompletionQuestion
          question={this.state.question}
          nextQuestion={this.nextQuestion.bind(this)}
          words={this.state.words}
          roots={this.state.roots} />
      } else if (type.startsWith('spell')) {
        return <SpellQuestion
          word={this.state.question.word}
          isEasy={type === 'spellEasy'}
          nextQuestion={this.nextQuestion.bind(this)}
          words={this.state.words}
          roots={this.state.roots} />        
      } else {
        return <ButtonQuestion 
          word={this.state.question.word} 
          nextQuestion={this.nextQuestion.bind(this)} 
          words={this.state.words} 
          roots={this.state.roots} />
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
        <div style={{height:'25px', marginBottom:'30px'}}>
          <h4 style={{textAlign:'left',color:color.gray,height:'5px',fontSize:'0.85em'}}>
            {this.state.isInterlude ? 'Skip to Next Question' : 'Check Answer'}
          </h4>
          <img src={enterKey} alt='enter-key' style={{height:'100%',width:'auto'}} />
        </div>        
      </div>
    }

    return (
      <Layout>
        <div style={{height:'20%'}}>
          <h4 style={{fontSize:'1.2em',padding:'10px 0px 0px 10px'}}>{this.state.name}</h4>
          <div style={{width:'50%',margin:'0 auto'}}>
            <ProgressBar width={progress} checkpoints={this.state.checkpoints || []} />
          </div>        
        </div>
        <div style={{height:'77.5%',width:'85%',margin:'0 auto',paddingTop:'2.5%',textAlign:'center'}}>
          {this.state.question && !this.state.isInterlude && question()}
          {this.state.question && <OnCorrectImage word={this.state.question.word} display={this.state.isInterlude} />}
        </div>
        {directions()}
      </Layout>
    );
  }
}

const Layout = styled.div`
  height: 600px;
  ${breakpoints.largeWH} {
    height: 525px;
  }    
`

export default Game;
