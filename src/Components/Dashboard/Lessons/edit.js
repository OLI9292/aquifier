import axios from 'axios';
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import _ from 'underscore';
import styled from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea';

import addPng from '../../../Library/Images/add.png';
import CONFIG from '../../../Config/main';
import { color } from '../../../Library/Styles/index';
import deletePng from '../../../Library/Images/delete.png';
import Lesson from '../../../Models/Lesson';
import Link from '../../Common/link';
import RelatedWords from './relatedWords';
import Textarea from '../../Common/textarea';
import Word from '../../../Models/Word';
import User from '../../../Models/User';
import { unixTime } from '../../../Library/helpers';

const fileUploadState = {
  unchosen: { text: 'Choose File', backgroundColor: '#f1f1f1', color: color.darkGray },
  uploading: { text: 'Uploading' , backgroundColor: color.red, color: 'white' }
}

class LessonEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMsg: '',
      filenames: [],
      fileUploadStatus: 'unchosen',
      isNewLesson: true,
      lessonTitle: '',
      questions: [],
      relatedWords: [],
      words: []
    }
  }

  async componentDidMount() {
    const userId = User.loggedIn('_id');
    const words = _.pluck(JSON.parse(localStorage.getItem('words')), 'value');
    this.setState({ userId: userId, words: words }, this.loadLesson);
  }

  loadLesson = async () => {
    const id = _.last(window.location.href.split('/'));
    if (id !== 'new') {
      const result = await Lesson.fetch(id);
      if (result.data) {
        const lesson = result.data;
        this.setState({
          lessonTitle: lesson.name,
          filenames: lesson.filenames,
          questions: lesson.questions.map((q) => { q.include = true; return q; }),
          isNewLesson: false,
          lessonId: id
        }, () => this.loadRelatedWords(_.pluck(lesson.questions, 'word')));
      }
    }
  }

  loadRelatedWords = async (words) => {
    const result = await Word.relatedWords(words.join(','));
    if (result.data) { this.setState({ relatedWords: result.data }) }
  }  

  handleSaveLesson() {
    let errorMsg

    if (!this.state.lessonTitle)       { errorMsg = 'Please enter a lesson title.' };
    if (!this.state.questions.length)  { errorMsg = 'Lessons require at least 1 WORD / PASSAGE.' };

    errorMsg
      ? this.setState({ errorMsg })
      : this.save();
  }

  save = async () => {
    const questions = this.state.questions
      .filter((q) => q.context.includes(q.word.toLowerCase()) && q.include)
      .map((q) => ({ word: q.word.toLowerCase(), context: q.context, related: q.related }));

    const data = {
      name: this.state.lessonTitle,
      filenames: this.state.filenames,
      updatedOn: unixTime(),
      questions: questions,
      public: this.state.userId === CONFIG.ADMIN_ID
    }

    const result = this.state.isNewLesson
      ? (await Lesson.create(data))
      : (await Lesson.update(this.state.lessonId, data));

    result.data.error
      ? this.setState({ errorMsg: 'There was an error saving the lesson.  Please try again.' })
      : this.setState({ redirect: '/lessons' });
  }  

  handleFiles = async (files) => {
    if (files.length) {
      const formData = new FormData();
      formData.append('text', files[0]);
      const options = { headers: { 'Content-Type': 'multipart/form-data' } };
      
      this.setState({ fileUploadStatus: 'uploading' });
      const result = await axios.post(`${CONFIG.WORDS_API}/texts/parse`, formData, options);
      if (_.isEmpty(result.data)) { return };

      const filenames = _.union(this.state.filenames, [files[0].name]);
      const questions = _.union(this.state.questions, result.data.map((q) => { q.include = false; return q; }));

      this.setState({
        fileUploadStatus: 'unchosen',
        filenames: filenames,
        questions: questions
      }, () => this.loadRelatedWords(_.pluck(questions, 'word')));

      this.fileInput.value = '';
    }
  }

  handleAddRow(i) {
    this.setState({ questions: this.state.questions.map((q,idx) => {
      if (i === idx) { q.include = true };
      return q;
    })});
  }  

  handleDeleteRow(i) {
    let questions = this.state.questions;
    questions.splice(i, 1);
    this.setState({ questions });
  }  

  updateRelatedWords(index, relatedWords) {
    const questions = this.state.questions;
    questions[index].related = relatedWords;
    this.setState({ questions });
  }

  updateContext(index, context) {
    const questions = this.state.questions;
    questions[index].context = context;
    this.setState({ questions });
  }  

  render() {
    if (this.state.redirect && !window.location.href.endsWith(this.state.redirect)) {
      return <Redirect push to={this.state.redirect} />;
    }

    const navigation = (() => {
      return <div style={{height:'50px'}}>
        <Link.large 
          onClick={() => this.setState({ redirect: '/lessons' })}
          style={{display:'inline-block',float:'left',color:color.blue}}
          >Back</Link.large>
        <Link.large 
          onClick={() => this.handleSaveLesson()} 
          style={{display: 'inline-block',float:'right',color:color.green}}
          >Save</Link.large>
      </div>
    })()

    const questions = () => {
      return this.state.questions.map((m, i) => {
        const even = i % 2 === 0;
        const isFocused = this.state.focused === i;
        const isHovered = this.state.hovered === i;
        const textareaBackgroundColor = isHovered || isFocused
          ? even ? 'white' : color.lightestGray
          : even ? color.lightestGray : 'white'
        const rowBackgroundColor = even ? color.lightestGray : 'white';

        return <tr style={{width:'100%',backgroundColor:rowBackgroundColor}} key={i}>
          <th style={{width:'15%'}}>
            <img alt='delete' src={m.include ? deletePng : addPng}
              style={{float:'left',marginLeft:'15px',height:'30px',cursor: 'pointer'}}         
              onClick={() => m.include ? this.handleDeleteRow(i) : this.handleAddRow(i)}/>
            {m.word}
          </th>
          <td style={{width:'50%'}}>
            <TextareaAutosize
              spellCheck={'false'}
              style={resizableTextAreastyles(textareaBackgroundColor)}
              onMouseEnter={() => this.setState({ hovered: i })}
              onMouseLeave={() => this.setState({ hovered: null })}
              onFocus={() => this.setState({ focused: i })}
              value={m.context}
              onChange={(e) => this.updateContext(i, e.target.value)}
            />
          </td>
          <td style={{width:'35%'}}>
            <RelatedWords
              index={i}
              updateRelatedWords={this.updateRelatedWords.bind(this)}
              words={this.state.words}
              added={m.related || []}
              suggested={this.state.relatedWords[m.word]}
            />
          </td>
        </tr>
      })
    }

    const questionsTable = (() => {
      if (this.state.questions.length) {
        return <Table>
          <tbody>
            <tr style={{width:'100%'}}>
              <td style={{width:'15%',fontSize:'1.5em',paddingLeft:'45px'}}>WORD</td>
              <td style={{width:'50%',fontSize:'1.5em',textAlign:'center'}}>PASSAGE</td>
              <td style={{width:'35%',fontSize:'1.5em',textAlign:'center'}}>RELATED WORDS</td>
            </tr>
            {questions()}
          </tbody>
        </Table>
      }
    })()

    const settings = (() => {
      const state = fileUploadState[this.state.fileUploadStatus];
      return <table>
        <tbody>
          <SettingsRow>
            <SettingsHeader>Title</SettingsHeader>
            <td style={{paddingLeft:'20px'}}>
              <Textarea.medium
                placeholder={'ex. The Giver'}
                value={this.state.lessonTitle}
                onChange={(e) => this.setState({ lessonTitle: e.target.value })}/>
            </td>
          </SettingsRow>

          <SettingsRow>
            <SettingsHeader>Text</SettingsHeader>
            <td style={{paddingLeft:'20px'}}>
              {this.state.filenames.map((name,i) => <FileLabel key={i} color={'white'} bColor={color.green}>{name}</FileLabel>)} 
              <FileLabel color={state.color} bColor={state.backgroundColor}>
                {state.text}
                <input type='file' 
                  ref={ref => this.fileInput = ref }
                  onChange={(e) => this.handleFiles(e.target.files)}
                  style={{visibility:'hidden'}} />
              </FileLabel>
            </td>
          </SettingsRow>
        </tbody>
      </table>
    })()

    return (
      <div style={{width:'95%',margin:'0 auto',paddingTop:'25px'}}>
        {navigation}
        <ErrorMessage>{this.state.errorMsg}</ErrorMessage>
        {settings}
        {questionsTable}
      </div>
    );
  }
}

const resizableTextAreastyles = (textareaBackgroundColor) => {
  return {
    backgroundColor: textareaBackgroundColor,
    border: 'none',
    borderRadius: '5px',
    fontFamily: 'BrandonGrotesque',
    transitionDuration: '0.2s',
    width: '90%',
    outline: '0',
    padding: '10px 10px 25px 10px',
    fontSize: '0.8em',
    verticalAlign: 'middle',
    margin: '10px'
  }
}

const ErrorMessage = styled.p`
  color: ${color.red};
  height: 15px;
  line-height: 15px;
  text-align: right;
`

const FileLabel = styled.label`
  height: 50px;
  line-height: 50px;
  margin-bottom: 10px;
  font-size: 1.25em;
  background-color: ${props => props.bColor};
  color: ${props => props.color};
  transition-duration: 0.2s;
  border-radius: 5px;
  font-family: BrandonGrotesque;
  display: block;
  width: 240px;
  padding-left: 10px;
`

const SettingsRow = styled.tr`
  vertical-align: top;
  height: 75px;
`

const SettingsHeader = styled.tr`
  width: 100px;
  font-size: 1.5em;
  text-align: left;
`

const Table = styled.table`
  width: 100%;
  font-size: 1.25em;
  border-collapse: separate;
  border-spacing: 0 1em;
`

export default LessonEdit;
