import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';
import axios from 'axios';

import Button from '../Common/button';
import Link from '../Common/link';
import deletePng from '../../Library/Images/delete.png';
import checkboxChecked from '../../Library/Images/checkbox-checked.png';
import checkboxUnchecked from '../../Library/Images/checkbox-unchecked.png';
import Textarea from '../Common/textarea';
import TextareaAutosize from 'react-autosize-textarea';
import { color } from '../../Library/Styles/index';
import Lesson from '../../Models/Lesson';
import Class from '../../Models/Class';
import CONFIG from '../../Config/main';

const fileUploadState = {
  unchosen: { text: 'Choose File', backgroundColor: '#f1f1f1', color: color.darkGray },
  uploading: { text: 'Uploading' , backgroundColor: color.red, color: 'white' },
  complete: { backgroundColor: color.green, color: 'white' }
}

class LessonsDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.loadClasses();
    this.reset();
  }

  loadClasses = async () => {
    const userId = localStorage.getItem('userId');
    const result = await Class.forTeacher(userId);
    const classes = result.data || [];
    classes.forEach((c) => c.checked = false);
    this.setState({ classes });
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
      this.setState(state);
      this.fileInput.value = '';
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

  handleClickedSave() {
    let errorMsg

    if (!this.state.lessonTitle) {
      errorMsg = 'Please enter a lesson title.'
    } else if (!this.state.textMatches.length) {
      errorMsg = 'Lessons require at least 1 WORD / PASSAGE.'
    }

    if (errorMsg) {
      this.setState({ errorMsg });
    } else {
      this.save();
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
    const createdOn = Date.now();
    const questions = this.state.textMatches.map((m) => ({ word: m.word.toLowerCase(), context: m.context }));
    
    const data = {
      name: name,
      filename: filename,
      updatedOn: createdOn,
      questions: questions
    }
    
    // const result = await Lesson.create(data);
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect} />;
    }

    const allLessons = () => {
      return <div>
        <Header>My Lessons</Header>
        <Button.small
          color={color.red} style={{float:'right',margin:'-65px 25px 0px 0px'}}
          onClick={() => this.setState({ isEditing: !this.state.isEditing })}
        >Create</Button.small>
      </div>
    }

    const textMatchesTable = () => {
      return <TextMatchesTable>
        <tbody>
          <tr style={{width:'100%'}}>
            <td style={{width:'30%',fontSize:'1.5em',paddingLeft:'45px'}}>WORD</td>
            <td style={{width:'70%',fontSize:'1.5em'}}>PASSAGE</td>
          </tr>
          {
            this.state.textMatches.map((m, i) => {
              const even = i % 2 === 0;
              const isFocused = this.state.focused === i;
              const isHovered = this.state.hovered === i;
              const textareaBackgroundColor = isHovered || isFocused
                ? even ? 'white' : color.lightestGray
                : even ? color.lightestGray : 'white'
              const resizableTextAreastyles = {
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
              const rowBackgroundColor = even ? color.lightestGray : 'white';
              return <tr style={{width:'100%',backgroundColor:rowBackgroundColor}} key={i}>
                <th style={{width:'30%',fontStyle:'bold'}}>
                  <DeleteImage style = {{float:'left',marginLeft:'15px'}} src={deletePng} onClick={() => this.handleDeleteRow(i)}/>
                  {m.word}
                </th>
                <td style={{width:'70%'}}>
                  <TextareaAutosize
                    spellCheck={'false'}
                    style={resizableTextAreastyles}
                    onMouseEnter={() => this.setState({ hovered: i })}
                    onMouseLeave={() => this.setState({ hovered: null })}
                    onFocus={() => this.setState({ focused: i })}
                    value={m.context}
                  />
                </td>
              </tr>
            })
          }
        </tbody>
      </TextMatchesTable>
    }

    const editingLesson = () => {
      const fileUploadStatus = this.state.fileUploadStatus;
      const state = fileUploadState[fileUploadStatus];
      const fileIsUploaded = fileUploadStatus === 'complete';
      const deleteTextVisibility = fileIsUploaded ? 'visible' : 'hidden';
      console.log(this.state.classes)
      return <div>
        <div style={{height:'50px'}}>
          <Link.large onClick={() => this.reset()} style={{display:'inline-block',float:'left'}} color={color.blue}>Back</Link.large>
          <Link.large onClick={() => this.handleClickedSave()} style={{display: 'inline-block',float:'right'}} color={color.green}>Save</Link.large>
        </div>
        <ErrorMessage>{this.state.errorMsg}</ErrorMessage>        
        <table>
          <tbody>
          <tr style={{verticalAlign:'top',height:'75px'}}>
            <th style={{width:'100px',fontSize:'1.5em',textAlign:'left'}}>Title</th>
            <td>
              <Textarea.medium placeholder={'ex. The Giver'} onChange={(e) => this.setState({ lessonTitle: e.target.value })}/>
            </td>
          </tr>
          <tr style={{verticalAlign:'top',height:'75px'}}>
            <th style={{width:'100px',fontSize:'1.5em',textAlign:'left'}}>Text</th>
            <td>
              <FileUploadLabel backgroundColor={state.backgroundColor} color={state.color}>
                {this.state.filename || state.text}
                <input type='file' style={{visibility: 'hidden'}} ref={ref => this.fileInput = ref }
                  onChange={(e) => { if (!fileIsUploaded) { this.handleFiles(e.target.files) } }} />
              </FileUploadLabel>
            </td>
            <DeleteImage style={{visibility:deleteTextVisibility}} onClick={() => this.handleDeleteFile()} src={deletePng} />
          </tr>
          <tr style={{verticalAlign:'top',height:'75px'}}>
            <th style={{width:'100px',fontSize:'1.5em',textAlign:'left'}}>Classes</th>
            <td>
              {
                this.state.classes.map((c,i) => {
                  return <div style={{height:'20px',marginBottom:'10px',display:'flex',alignItems:'center',cursor:'pointer'}} onClick={() => this.handleClassClick(i)}>
                    <img style={{height:'20px'}} src={c.checked ? checkboxChecked : checkboxUnchecked} />
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
        {
          this.state.isEditing 
            ? editingLesson()
            : allLessons()
        }
      </Layout>
    );
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

const PassageTextArea = Textarea.default.extend`
  width: 95%;
  margin: 0 auto;
`

const Layout = styled.div`
  width: 95%;
  margin: 0 auto;
  padding-top: 25px;
`

const Header = styled.p`
  width: 100%;
  font-size: 2.75em;
  padding-top: 25px;
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

const TextMatchesTable = styled.table`
  width: 100%;
  font-size: 1.25em;
  border-collapse: separate;
  border-spacing: 0 1em;
`

export default LessonsDashboard;
