import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';
import axios from 'axios';
import moment from 'moment';

import Button from '../Common/button';
import Class from '../../Models/Class';
import { color } from '../../Library/Styles/index';
import CONFIG from '../../Config/main';
import deletePng from '../../Library/Images/delete.png';
import upArrow from '../../Library/Images/arrow_up.png';
import downArrow from '../../Library/Images/arrow_down.png';
import Link from '../Common/link';
import Textarea from '../Common/textarea';
import { unixTime, move } from '../../Library/helpers';
import Word from '../../Models/Word';
import WordList from '../../Models/WordList';

class WordListsDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentlyEditing: {},
      isEditing: false,
      search: '',
      wordLists: [],
      words: [],
      errorMsg: ''
    };
  }

  componentDidMount() {
    this.loadWordLists();
    this.loadWords();
  }

  reset() {
    this.setState({ currentlyEditing: {}, isEditing: false, search: '' }, this.loadWordLists);
  }

  loadWordLists = async () => {
    const result = await WordList.fetch();
    console.log(1)
    const wordLists = result.data || [];
    this.setState({ wordLists });    
  }

  loadWords = async () => {
    const result = await Word.fetch();
    console.log(2)
    const words = _.pluck((result.data.words || []), 'value');
    this.setState({ words });    
  }  

  handleDeleteWordList = async (i) => {
    if (window.confirm(`Are you sure you want to delete ${this.state.wordLists[i].name}?`)) {
      const wordLists = this.state.wordLists;
      const result = await WordList.delete(wordLists[i]._id);
      if (!result.error) {
        wordLists.splice(i, 1);
        this.setState({ wordLists });
      } else {
        alert(`Error: ${result.error}`);
      }
    }
  }

  handleEditWordList(i) {
    const wordList = this.state.wordLists[i];
    const currentlyEditing = {
      name: wordList.name,
      category: wordList.category,
      description: wordList.description,
      questions: wordList.questions.map((l) => ({ word: l.word, difficulty: l.difficulty }))
    }

    this.setState({ 
      currentlyEditing: currentlyEditing, 
      isEditing: true,
      isNewWordList: false, 
      wordListId: wordList._id 
    })
  }

  handleSaveWordList = async () => {
    let errorMsg

    if (!this.state.currentlyEditing.name) {
      errorMsg = 'Please enter a name.'
    } else if (!this.state.currentlyEditing.category) {
      errorMsg = 'Please enter a category.'
    } else if (!this.state.currentlyEditing.description) {
      errorMsg = 'Please enter a description.'
    } else if (!this.state.currentlyEditing.questions) {
      errorMsg = 'Lists require at least 1 question.'
    }

    if (errorMsg) {
      this.setState({ errorMsg });
    } else {
      const result = this.state.isNewWordList
        ? (await WordList.create(this.state.currentlyEditing))
        : (await WordList.update(this.state.wordListId, this.state.currentlyEditing));
      this.reset()
    }
  }

  handleDeleteQuestion(index) {
    const currentlyEditing = this.state.currentlyEditing;
    currentlyEditing.splice(index, 1);
    this.setState({ currentlyEditing });
  }

  handleChangeIndex(fromIndex, toIndex) {
    if (toIndex < 0) { return };
    const currentlyEditing = this.state.currentlyEditing;
    const questions = move(currentlyEditing.questions, fromIndex, toIndex);
    currentlyEditing.questions = questions
    this.setState({ currentlyEditing });
  }

  updateDifficulty(index, difficulty, onBlur = false) {
    const currentlyEditing = this.state.currentlyEditing;
    if (onBlur && !_.contains([0,1,2], difficulty)) { difficulty = 0 };
    currentlyEditing.questions[index].difficulty = difficulty;
    this.setState({ currentlyEditing });
  }

  addWord(word, difficulty = 0) {
    const currentlyEditing = this.state.currentlyEditing;
    const add = { word: word, difficulty: difficulty };
    currentlyEditing.questions = _.union(currentlyEditing.questions, [add]);
    this.setState({ currentlyEditing });
  }

  render() {
    if (this.state.redirect && !window.location.href.endsWith(this.state.redirect)) {
      return <Redirect push to={this.state.redirect} />;
    }

    const searched = this.state.words
      .filter((w) => w.includes(this.state.search))
      .slice(0,25)
      .sort()
      .map((w,i) => <Searched key={i} onClick={() => this.addWord(w)}>{w}</Searched>)
      .reduce((acc, x) => acc === null ? [x] : [acc, ', ', x], null)      

    const wordSearch = () => {
      return <AddMoreContainer display={this.state.displayWordSearch}>
        <h4 style={{textAlign:'center'}}>Add Words</h4>
        <p style={{color:color.blue,float:'right',cursor:'pointer',margin:'-55px 15px 0px 0px',fontSize:'0.9em'}} 
          onClick={() => this.setState({ displayWordSearch: false })}>DONE</p>
        <div style={{textAlign:'center'}}>
          <p style={{fontSize:'0.75em',display:'inline-block',verticalAlign:'text-bottom',marginRight:'10px'}}>Search</p>
          <Textarea.small style={{display:'inline-block'}} onChange={(e) => this.setState({ search: e.target.value })}></Textarea.small>
        </div>
        <div style={{fontSize:'0.75em',width:'90%',margin:'0 auto',marginTop:'25px'}}>
          {searched}
        </div>
      </AddMoreContainer>
    }    

    const allWordLists = () => {
      return <div>
        <Header>Word Lists</Header>
        <Button.small
          color={color.red} style={{float:'right',margin:'-65px 25px 0px 0px'}}
          onClick={() => this.setState({ isEditing: true, isNewWordList: true })}
        >Create</Button.small>
        <Table>
          <tbody>
            <tr>
              <td style={{width:'10%'}}></td>
              <td style={{width:'35%',textAlign:'center'}}>NAME</td>
              <td style={{width:'25%',textAlign:'center'}}>QUESTIONS</td>
              <td style={{width:'30%',textAlign:'center'}}>UPDATED ON</td>
            </tr>
            {
              this.state.wordLists.map((l, i) => {
                const backgroundColor = i % 2 === 0 ? color.lightestGray : 'white';
                return <tr style={{height:'80px',width:'100%',backgroundColor:backgroundColor}} key={i}>
                  <td style={{width:'10%'}}>
                    <LessonButton color={color.red} onClick={() => this.handleDeleteWordList(i)}>delete</LessonButton>
                    <LessonButton color={color.blue} onClick={() => this.handleEditWordList(i)}>edit</LessonButton>
                  </td>
                  <th style={{width:'35%',textAlign:'center'}}>{l.name}</th>
                  <td style={{width:'25%',textAlign:'center'}}>{l.questions.length}</td>
                  <td style={{width:'30%',textAlign:'center'}}></td>
                </tr>
              })
            }
          </tbody>
        </Table>
      </div>
    }

    const questionsTable = () => {
      return <Table>
        <tbody>
          <tr style={{width:'100%'}}>
            <td style={{width:'30%',fontSize:'1.5em',paddingLeft:'45px'}}></td>
            <td style={{width:'45%',fontSize:'1.5em',textAlign:'center'}}>WORD</td>
            <td style={{width:'25%',fontSize:'1.5em',textAlign:'center'}}>DIFFICULTY</td>
          </tr>
          {questions()}
        </tbody>
      </Table>
    }    

    const questions = () => {
      return this.state.currentlyEditing.questions.map((m, i) => {
        return <tr style={{width:'100%'}} key={i}>
          
          <td style={{width:'30%',textAlign:'center'}}>
            <div style={{display:'inline-block',margin:'5px',verticalAlign:'middle'}}>
              <DeleteImage src={deletePng} onClick={() => this.handleDeleteQuestion(i)}/>
            </div>
            <div style={{display:'inline-block',margin:'5px',verticalAlign:'middle'}}>
              <DeleteImage src={upArrow} onClick={() => this.handleChangeIndex(i, i - 1)}/>
            </div>
            <div style={{display:'inline-block',margin:'5px',verticalAlign:'middle'}}>
              <DeleteImage src={downArrow} onClick={() => this.handleChangeIndex(i, i + 1)}/>
            </div>                        
          </td>
          
          <td style={{width:'45%',textAlign:'center'}}>
            {m.word}
          </td>
          
          <td style={{width:'25%'}}>
            <Textarea.medium style={{verticalAlign:'middle',textAlign:'center'}}
              onFocus={(e) => this.updateDifficulty(i, '')}
              onChange={(e) => this.updateDifficulty(i, parseInt(e.target.value) || 0)}
              value={m.difficulty} 
              onKeyPress={(e) => { if (e.key === 'enter') { this.updateDifficulty(i, parseInt(e.target.value)) } } }
              onBlur={(e) => this.updateDifficulty(i, parseInt(e.target.value), true)}
            />
          </td>

        </tr>
      })      
    }

    const editingWordList = () => {
      return <div>
        <div style={{height:'50px'}}>
          <Link.large onClick={() => this.reset()} style={{display:'inline-block',float:'left'}} color={color.blue}>Back</Link.large>
          <Link.large onClick={() => this.handleSaveWordList()} style={{display: 'inline-block',float:'right'}} color={color.green}>Save</Link.large>
        </div>
        <ErrorMessage>{this.state.errorMsg}</ErrorMessage>        
        <table>
          <tbody>
          
          <EditRow>
            <EditTableHeader>Name</EditTableHeader>
            <td>
              <Textarea.medium
                placeholder={'ex. Keystar 1'}
                value={this.state.currentlyEditing.name}
                onChange={(e) => { const c = this.state.currentlyEditing; c.name = e.target.value; this.setState({ currentlyEditing: c }) }}
              />
            </td>
          </EditRow>

          <EditRow>
            <EditTableHeader>Category</EditTableHeader>
            <td>
              <Textarea.medium
                placeholder={'ex. ESL'}
                value={this.state.currentlyEditing.category}
                onChange={(e) => { const c = this.state.currentlyEditing; c.category = e.target.value; this.setState({ currentlyEditing: c }) }}
              />
            </td>
          </EditRow>

          <EditRow>
            <EditTableHeader>Description</EditTableHeader>
            <td>
              <Textarea.medium long
                placeholder={'ex. English as a Second Language'}
                value={this.state.currentlyEditing.description}
                onChange={(e) => { const c = this.state.currentlyEditing; c.description = e.target.value; this.setState({ currentlyEditing: c }) }}
              />
            </td>
          </EditRow>

          </tbody>
        </table>
        {this.state.currentlyEditing && this.state.currentlyEditing.questions && questionsTable()}
        {wordSearch()}
        <DarkBackground display={this.state.displayWordSearch} onClick={() => this.setState({ displayWordSearch: false })} />
        <div style={{textAlign:'center',width:'100%',marginTop:'25px',paddingBottom:'25px'}}>
          <Button.medium onClick={() => this.setState({ displayWordSearch: true })}>ADD</Button.medium>
        </div>
      </div>
    }

    return (
      <Layout>
        {this.state.isEditing ? editingWordList() : allWordLists()}
      </Layout>
    );
  }
}

const EditRow = styled.tr`
  vertical-align: top;
  height: 75px;
`

const EditTableHeader = styled.th`
  width: 100px;
  fontSize: 1.5em;
  text-align: left;
`

const DeleteImage = styled.img`
  height: 30px;
  cursor: pointer;
  margin-left: 10px;
`

const ErrorMessage = styled.p`
  color: ${color.red};
  height: 15px;
  line-height: 15px;
  text-align: right;
`

const Header = styled.p`
  width: 100%;
  font-size: 2.75em;
  padding-top: 25px;
  text-align: center;
  height: 25px;
`

const Layout = styled.div`
  width: 95%;
  margin: 0 auto;
  padding-top: 25px;
`

const LessonButton = styled.p`
  color: ${props => props.color};
  height: 10px;
  line-height: 10px;
  cursor: pointer;
  margin-left: 15px;
`

const Table = styled.table`
  width: 100%;
  font-size: 1.25em;
  border-collapse: separate;
  border-spacing: 0 1em;
`

const AddMoreContainer = styled.div`
  display: ${props => props.display ? '' : 'none'};
  position: fixed;
  width: 450px;
  height: 350px;
  background-color: white;
  top: 50%;
  left: 50%;
  margin-top: -175px;
  margin-left: -225px;
  border-radius: 15px;  
  z-index: 10;
`

const DarkBackground = styled.div`
  display: ${props => props.display ? '' : 'none'};
  z-index: 5;
  background-color: rgb(0, 0, 0);
  opacity: 0.7;
  -moz-opacity: 0.7;
  filter: alpha(opacity=70);
  height: 100%;
  width: 100%;
  background-repeat: repeat;
  position: fixed;
  top: 0px;
  left: 0px;
`

const Searched = styled.span`
  color: ${color.blue};
  &:hover {
    color: ${color.blue10l};
  }
  cursor: pointer;
`

export default WordListsDashboard;
