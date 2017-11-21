import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';
import axios from 'axios';
import moment from 'moment';

import Button from '../Common/button';
import checkboxChecked from '../../Library/Images/checkbox-checked.png';
import checkboxUnchecked from '../../Library/Images/checkbox-unchecked.png';
import Class from '../../Models/Class';
import { color } from '../../Library/Styles/index';
import CONFIG from '../../Config/main';
import deletePng from '../../Library/Images/delete.png';
import Lesson from '../../Models/Lesson';
import Link from '../Common/link';
import RelatedWords from './relatedWords';
import Textarea from '../Common/textarea';
import TextareaAutosize from 'react-autosize-textarea';
import { unixTime } from '../../Library/helpers';
import Word from '../../Models/Word';

const fileUploadState = {
  unchosen: { text: 'Choose File', backgroundColor: '#f1f1f1', color: color.darkGray },
  uploading: { text: 'Uploading' , backgroundColor: color.red, color: 'white' },
  complete: { backgroundColor: color.green, color: 'white' },
  uneditable: { backgroundColor: color.green, color: 'white' },
}

class LessonsDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: [],
      lessons: [],
      relatedWords: [],
      words: []
    };
  }

  componentDidMount() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.setState({ userId: userId }, this.loadData);
      this.reset();
    }
  }

  loadData() {
    this.loadLessons();
    this.loadClasses();
    this.loadWordData();
  }

  loadLessons = async () => {
    const result = await Lesson.forTeacher(this.state.userId);
    const lessons = result.data || [];
    this.setState({ lessons });
  }

  loadClasses = async () => {
    const result = await Class.forTeacher(this.state.userId);
    const classes = result.data || [];
    classes.forEach((c) => c.checked = false);
    this.setState({ classes });
  }

  loadWordData = async () => {
    const wordsRes = await Word.fetch();
    if (wordsRes.data) { this.setState({ words: _.pluck(wordsRes.data, 'value') }) }
  }

  loadRelatedWordData = async () => {
    const values = this.state.textMatches.map((m) => m.word).join(',');
    const relatedWordsRes = await Word.relatedWords(values);
    if (relatedWordsRes.data) { this.setState({ relatedWords: relatedWordsRes.data }) }
  }

  reset() {
    const state = {
      isEditing: false,
      fileUploadStatus: 'unchosen',
      textMatches: [],
      focused: null,
      hovered: null,
      errorMsg: '',
      lessonTitle: null,
      redirect: null,
      filename: null
    };

    this.setState(state);
  }

  handleFiles = async (files) => {
    if (files.length) {
      const formData = new FormData();
      formData.append('text', files[0]);
      const options = { headers: { 'Content-Type': 'multipart/form-data' } };
      this.setState({ fileUploadStatus: 'uploading' });
      const result = await axios.post(`${CONFIG.WORDS_API}/texts/parse`, formData, options);
      const state = result.data.length
        ? { fileUploadStatus: 'complete', filename: files[0].name, textMatches: result.data }
        : { fileUploadStatus: 'unchosen' };
      this.fileInput.value = '';
      this.setState(state, this.loadRelatedWordData);
    }
  }

  handleDeleteRow(i) {
    let textMatches = this.state.textMatches;
    textMatches.splice(i, 1);
    this.setState({ textMatches });
  }

  handleDeleteFile() {
    this.setState({ textMatches: [], fileUploadStatus: 'unchosen', filename: null });
  }

  handleSaveLesson() {
    let errorMsg

    if (!this.state.lessonTitle) {
      errorMsg = 'Please enter a lesson title.'
    } else if (!this.checkedClasses().length) {
      errorMsg = 'Please check at least 1 class.'
    } else if (!this.state.textMatches.length) {
      errorMsg = 'Lessons require at least 1 WORD / PASSAGE.'
    }

    if (errorMsg) {
      this.setState({ errorMsg });
    } else {
      this.save();
    }
  }

  checkedClasses() {
    return this.state.classes.filter((c) => c.checked).map((c) => c._id);
  }

  handleEditLesson(i) {
    const lesson = this.state.lessons[i];
    const lessonTitle = lesson.name;
    const filename = lesson.filename;
    const questions = lesson.questions;
    const classes = this.state.classes.map((c) => {
      const copy = c;
      copy.checked = _.includes(lesson.classes, copy._id);
      return copy;
    })
    this.setState({
      isEditing: true,
      lessonTitle: lessonTitle,
      filename: filename,
      textMatches: questions,
      classes: classes,
      isNewLesson: false,
      lessonId: this.state.lessons[i]._id
    }, this.loadRelatedWordData);
  }

  handleDeleteLesson = async (i) => {
    if (window.confirm(`Are you sure you want to delete ${this.state.lessons[i].name}?`)) {
      const result = await Lesson.delete(this.state.lessons[i]._id);
      if (!result.data.error) {
        const lessons = this.state.lessons;
        lessons.splice(i, 1);
        this.setState({ lessons });
      }
    }
  }

  handleClassClick(i) {
    const classes = this.state.classes;
    classes[i].checked = !classes[i].checked;
    this.setState({ classes });
  }

  save = async () => {
    const name = this.state.lessonTitle;
    const filename = this.state.filename;
    const createdOn = unixTime();
    const questions = this.state.textMatches
      .filter((m) => m.context.includes(m.word.toLowerCase()))
      .map((m) => ({ word: m.word.toLowerCase(), context: m.context, related: m.related }));

    const data = {
      name: name,
      filename: filename,
      updatedOn: createdOn,
      questions: questions,
      classes: this.checkedClasses(),
      public: this.state.userId === CONFIG.ADMIN_ID
    }

    const result = this.state.isNewLesson
      ? (await Lesson.create(data))
      : (await Lesson.update(this.state.lessonId, data));

    result.data.error
      ? this.setState({ errorMsg: 'There was an error saving the lesson.  Please try again.' })
      : this.setState({ isEditing: false }, this.loadLessons);
  }

  updateRelatedWords(index, relatedWords) {
    const textMatches = this.state.textMatches;
    textMatches[index].related = relatedWords;
    this.setState({ textMatches });
  }

  updateContext(index, context) {
    const textMatches = this.state.textMatches;
    textMatches[index].context = context;
    this.setState({ textMatches });
  }

  render() {
    if (this.state.redirect && !window.location.href.endsWith(this.state.redirect)) {
      return <Redirect push to={this.state.redirect} />;
    }

    const allLessons = () => {
      return <div>
        <Header>My Lessons</Header>
        <Button.small
          color={color.red} style={{float:'right',margin:'-65px 25px 0px 0px'}}
          onClick={() => this.setState({ isEditing: true, isNewLesson: true })}
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
              this.state.lessons.map((l, i) => {
                const backgroundColor = i % 2 === 0 ? color.lightestGray : 'white';
                return <tr style={{height:'80px',width:'100%',backgroundColor:backgroundColor}} key={i}>
                  <td style={{width:'10%'}}>
                    <LessonButton color={color.red} onClick={() => this.handleDeleteLesson(i)}>delete</LessonButton>
                    <LessonButton color={color.blue} onClick={() => this.handleEditLesson(i)}>edit</LessonButton>
                  </td>
                  <th style={{width:'35%',textAlign:'center'}}>{l.name}</th>
                  <td style={{width:'25%',textAlign:'center'}}>{l.questions.length}</td>
                  <td style={{width:'30%',textAlign:'center'}}>{moment.unix(l.updatedOn).format('MMM Do YY')}</td>
                </tr>
              })
            }
          </tbody>
        </Table>
      </div>
    }

    const questions = () => {
      return this.state.textMatches.map((m, i) => {
        const even = i % 2 === 0;
        const isFocused = this.state.focused === i;
        const isHovered = this.state.hovered === i;
        const textareaBackgroundColor = isHovered || isFocused
          ? even ? 'white' : color.lightestGray
          : even ? color.lightestGray : 'white'
        const rowBackgroundColor = even ? color.lightestGray : 'white';

        return <tr style={{width:'100%',backgroundColor:rowBackgroundColor}} key={i}>
          <th style={{width:'15%'}}>
            <DeleteImage style={{float:'left',marginLeft:'15px'}} src={deletePng} alt='delete' onClick={() => this.handleDeleteRow(i)}/>
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

    const textMatchesTable = () => {
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

    const editingLesson = () => {
      const fileUploadStatus = this.state.fileUploadStatus;
      const state = fileUploadState[fileUploadStatus];
      const fileIsUploaded = fileUploadStatus === 'complete';
      const deleteTextVisibility = fileIsUploaded ? 'visible' : 'hidden';
      return <div>
        <div style={{height:'50px'}}>
          <Link.large onClick={() => this.reset()} style={{display:'inline-block',float:'left'}} color={color.blue}>Back</Link.large>
          <Link.large onClick={() => this.handleSaveLesson()} style={{display: 'inline-block',float:'right'}} color={color.green}>Save</Link.large>
        </div>
        <ErrorMessage>{this.state.errorMsg}</ErrorMessage>
        <table>
          <tbody>
          <tr style={{verticalAlign:'top',height:'75px'}}>
            <th style={{width:'100px',fontSize:'1.5em',textAlign:'left'}}>Title</th>
            <td>
              <Textarea.medium placeholder={'ex. The Giver'} value={this.state.lessonTitle} onChange={(e) => this.setState({ lessonTitle: e.target.value })}/>
            </td>
          </tr>
          <tr style={{verticalAlign:'top',height:'75px'}}>
            <th style={{width:'100px',fontSize:'1.5em',textAlign:'left'}}>Text</th>
            <td>
              <FileUploadLabel backgroundColor={state.backgroundColor} color={state.color}>
                {this.state.filename || state.text}
                <input type='file' style={{visibility: 'hidden'}} ref={ref => this.fileInput = ref } disabled={!this.state.isNewLesson}
                  onChange={(e) => { if (!fileIsUploaded) { this.handleFiles(e.target.files) } }} />
              </FileUploadLabel>
            </td>
            <DeleteImage style={{visibility:deleteTextVisibility}} onClick={() => this.handleDeleteFile()} src={deletePng} alt='delete' />
          </tr>
          <tr style={{verticalAlign:'top',height:'75px'}}>
            <th style={{width:'100px',fontSize:'1.5em',textAlign:'left'}}>Classes</th>
            <td>
              {
                this.state.classes.map((c,i) => {
                  return <div style={{height:'20px',marginBottom:'10px',display:'flex',alignItems:'center',cursor:'pointer'}} onClick={() => this.handleClassClick(i)}>
                    <img style={{height:'20px'}} src={c.checked ? checkboxChecked : checkboxUnchecked} alt={c.checked ? 'checked' : 'un-checked'} />
                    <p style={{fontFamily:'BrandonGrotesque',marginLeft:'5px'}}>{c.name}</p>
                  </div>
                })
              }
            </td>
          </tr>
          </tbody>
        </table>
        {!_.isEmpty(this.state.textMatches) && textMatchesTable()}
      </div>
    }

    return (
      <Layout>
        {this.state.isEditing ? editingLesson() : allLessons()}
      </Layout>
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

const DeleteImage = styled.img`
  height: 30px;
  cursor: pointer;
  margin-left: 10px;
`

const LessonButton = styled.p`
  color: ${props => props.color};
  height: 10px;
  line-height: 10px;
  cursor: pointer;
  margin-left: 15px;
`

const Layout = styled.div`
  width: 95%;
  margin: 0 auto;
  padding-top: 25px;
`

const Header = styled.p`
  width: 100%;
  font-size: 2.75em;
  text-align: center;
  height: 25px;
`

const FileUploadLabel = styled.label`
  height: 50px;
  line-height: 50px;
  font-size: 1.25em;
  background-color: ${props => props.backgroundColor};
  color: ${props => props.color};
  transition-duration: 0.2s;
  border-radius: 5px;
  font-family: BrandonGrotesque;
  display: block;
  width: 240px;
  padding-left: 10px;
`

const Table = styled.table`
  width: 100%;
  font-size: 1.25em;
  border-collapse: separate;
  border-spacing: 0 1em;
`

export default LessonsDashboard;
