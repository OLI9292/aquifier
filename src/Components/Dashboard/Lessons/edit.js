import axios from 'axios';
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import _ from 'underscore';
import styled from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea';

import addPng from '../../../Library/Images/add.png';
import Class from '../../../Models/Class';
import CONFIG from '../../../Config/main';
import checkboxChecked from '../../../Library/Images/checkbox-checked.png';
import checkboxUnchecked from '../../../Library/Images/checkbox-unchecked.png';
import { color } from '../../../Library/Styles/index';
import deletePng from '../../../Library/Images/delete.png';
import Lesson from '../../../Models/Lesson';
import Link from '../../Common/link';
import RelatedWords from './relatedWords';
import Textarea from '../../Common/textarea';
import Word from '../../../Models/Word';
import { unixTime } from '../../../Library/helpers';

const fileUploadState = {
  unchosen: { text: 'Choose File', backgroundColor: '#f1f1f1', color: color.darkGray },
  uploading: { text: 'Uploading' , backgroundColor: color.red, color: 'white' },
  uneditable: { backgroundColor: color.green, color: 'white' },
}

class LessonEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      classes: [],
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
    const userId = localStorage.getItem('userId');
    const words = _.pluck(JSON.parse(localStorage.getItem('words')), 'value');
    this.setState({ userId: userId, words: words }, this.loadClasses);
  }

  loadClasses = async () => {
    const result = await Class.forTeacher(this.state.userId);
    const classes = result.data || [];
    classes.forEach((c) => c.checked = false);
    this.setState({ classes }, this.loadLesson);
  }  

  loadLesson = async () => {
    const id = _.last(window.location.href.split('/'));
    if (id !== 'new') {
      const result = await Lesson.fetch(id);
      if (result.data) {
        const lesson = result.data;
        console.log(lesson)
        console.log(lesson.filename)
        this.setState({
          lessonTitle: lesson.name,
          filenames: [lesson.filename],
          questions: lesson.questions.map((q) => { q.include = true; return q; }),
          classes: this.state.classes.map((c) => {
            const copy = c; copy.checked = _.includes(lesson.classes, copy._id); return copy;
          }),
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

  checkedClasses() {
    return this.state.classes.filter((c) => c.checked).map((c) => c._id);
  }  

  handleSaveLesson() {
    let errorMsg

    if (!this.state.lessonTitle)       { errorMsg = 'Please enter a lesson title.' };
    if (!this.checkedClasses().length) { errorMsg = 'Please check at least 1 class.' };
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
      filename: _.last(this.state.filename),
      updatedOn: unixTime(),
      questions: questions,
      classes: this.checkedClasses(),
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

      this.setState({
        fileUploadStatus: 'complete',
        filename: files[0].name,
        questions: result.data.map((q) => { q.include = false; return q; })
      }, () => this.loadRelatedWords(_.pluck(result.data, 'word')));
      this.fileInput.value = '';
    }
  }

  handleClassClick(i) {
    const classes = this.state.classes;
    classes[i].checked = !classes[i].checked;
    this.setState({ classes });
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

    const fileUploadStatus = this.state.fileUploadStatus;
    const state = fileUploadState[fileUploadStatus];
    const fileIsUploaded = fileUploadStatus === 'complete';
    console.log(fileUploadStatus)

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
      return <table>
        <tbody>
          <SettingsRow>
            <SettingsHeader>Title</SettingsHeader>
            <td>
              <Textarea.medium
                placeholder={'ex. The Giver'}
                value={this.state.lessonTitle}
                onChange={(e) => this.setState({ lessonTitle: e.target.value })}/>
            </td>
          </SettingsRow>

          <SettingsRow>
            <SettingsHeader>Text</SettingsHeader>
            <td>
              {this.state.filenames.map((name,i) => <FileLabel key={i} color={'white'} bColor={color.green}>{name}</FileLabel>)} 
              <FileLabel color={state.color} bColor={state.backgroundColor}>
                {state.text}
                <input 
                  type='file' 
                  onChange={(e) => { if (!fileIsUploaded) { this.handleFiles(e.target.files) } }}
                  style={{visibility:'hidden'}}
                  ref={ref => this.fileInput = ref }
                  disabled={!this.state.isNewLesson} />
              </FileLabel>
            </td>
          </SettingsRow>

          <SettingsRow>
            <SettingsHeader>Classes</SettingsHeader>
            <td>
              {this.state.classes.map((c,i) => {
                return <ClassesContainer onClick={() => this.handleClassClick(i)} key={i}>
                  <img alt={c.checked ? 'checked' : 'un-checked'} style={{height:'20px'}}
                    src={c.checked ? checkboxChecked : checkboxUnchecked} />
                  <p style={{marginLeft:'5px'}}>{c.name}</p>
                </ClassesContainer>
              })}
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

const ClassesContainer = styled.div`
  height: 20px;
  marginBottom: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-family: BrandonGrotesque;
`

const ErrorMessage = styled.p`
  color: ${color.red};
  height: 15px;
  line-height: 15px;
  text-align: right;
`

const FileLabel = styled.label`
  height: 50px;
  line-height: 50px;
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
