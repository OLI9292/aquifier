import Firebase from '../../Networking/Firebase';
import React, { Component } from 'react';
import { Redirect } from 'react-router';
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
import Lesson from '../../Models/Lesson';
import { color, breakpoints } from '../../Library/Styles/index';

import leftArrow from '../../Library/Images/left-arrow.png';
import rightArrow from '../../Library/Images/right-arrow.png';
import enterKey from '../../Library/Images/enter.png';
import equalsKey from '../../Library/Images/equals.png';
import speedyPng from '../../Library/Images/speedy.png';

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nextQuestionIndex: 0,
      question: null,
      questions: [],
      score: 0,
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
    if (words && roots) {
      this.setState({ words: words, roots: roots, isTimed: isTimed }, this.setupGame);
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.refreshInterval);
    document.body.removeEventListener('keydown', this.handleKeydown.bind(this), true);
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

  handleKeydown(event) {
    if (event.key === 'Enter' && this.state.isInterlude) {
      clearTimeout(window.timeout);
      this.nextQuestion();
    }
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
      
      this.timer.track();
      
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

  runInterlude = async () => {
    const state = { isInterlude: true };
    if (this.state.isTimed) { state.score = this.state.score + 1 };
    if (this.state.time < 5) { state.isSpeedy = true };
    
    this.setState(state);
    window.timeout = setTimeout(() => { this.nextQuestion() }, 300000);    
  }

  nextQuestion = async () => {
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
    const username = localStorage.getItem('username');
    const isMultiplayer = this.props.settings.players === 'multi' && username;
    
    if (isMultiplayer) {
      const ref = Firebase.refs.games.child(this.props.settings.accessCode).child('players').child(username);
      if (ref) { ref.set(2) };  
    }

    this.setState({ gameOver: true });
  }

  multiplayerGameOver(username) {
  
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

    const gameOver = () => {
      return <div style={{textAlign:'center',paddingTop:'25px'}}>
        <p style={{fontSize:'3em',marginTop:'25px'}}>
          <span style={{color:color.blue}}>{this.state.name}</span> Complete!
        </p>
        <h1>{`You scored ${this.state.score}`}.</h1>
        <Button.medium style={{marginTop:'25px'}} color={color.blue} onClick={() => this.setState({ redirect: '/play' })}>
          Return
        </Button.medium>
      </div>
    }

    const game = () => {
      return <div>
        <div style={{height:'20%'}}>
          <h4 style={{fontSize:'1.2em',padding:'10px 0px 0px 10px'}}>{this.state.name}</h4>
          
          <SpeedyContainer display={this.state.isSpeedy}>
            <img src={speedyPng} alt='speedy-flame' style={{height:'100%',width:'auto'}} />
            <p style={{color:color.red,fontStyle:'italic',fontSize:'1.25em'}}>Speedy! +2</p>
          </SpeedyContainer>          

          <div style={{width:'30%',margin:'0 auto'}}>
            {
              this.state.isTimed
              ?
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-around',marginTop:'-80px'}}>
                <Timer
                  time={this.props.settings.time}
                  ref={instance => { this.timer = instance }}
                  gameOver={() => this.gameOver()} />
                <p style={{fontSize:'3em'}}>{this.state.score}</p>
              </div>    
              :
              <ProgressBar width={progress} checkpoints={this.state.checkpoints || []} />
            }
          </div>        
        </div>
        <div style={{height:'77.5%',width:'85%',margin:'0 auto',paddingTop:'2.5%',textAlign:'center',marginTop:'-60px'}}>
          {this.state.question && !this.state.isInterlude && question()}
          {this.state.question && <OnCorrectImage word={this.state.question.word} display={this.state.isInterlude} />}
        </div>
        {directions()}      
      </div>
    }

    return (
      <Layout>
        {this.state.gameOver ? gameOver() : game()}
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

const SpeedyContainer = styled.div`
  display: ${props => props.display ? 'flex' : 'none'};
  justify-content: space-evenly;
  align-items: center;
  width: 150px;
  height: 35px;
  float: right;
  margin: -50px 10px 0px 0px;
`

export default Game;
