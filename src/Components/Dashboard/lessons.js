import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';
import axios from 'axios';

import Button from '../Common/button';
import Link from '../Common/link';
import Textarea from '../Common/textarea';
import { color } from '../../Library/Styles/index';
import User from '../../Models/User';
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

    this.state = {
      isEditing: true,
      fileUploadStatus: 'unchosen'
    }
  }

  componentDidMount() {
    this.loadUser()
  }

  loadUser = async () => {
  }

  handleFiles = async (files) => {
    if (files.length) {
      const formData = new FormData();
      formData.append('text', files[0]);
      const options = { headers: { 'Content-Type': 'multipart/form-data' } };
      this.setState({ fileUploadIdx: 'uploading' });
      const result = await axios.post(`${CONFIG.WORDS_API}/texts/parse`, formData, options);
      const state = result.data.length
        ? { fileUploadIdx: 'complete', filename: files[0].name, textMatches: result.data.data }
        : { fileUploadIdx: 'unchosen' };
      this.setState(state);
    }
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

    const editingLesson = () => {
      const state = fileUploadState[this.state.fileUploadStatus];
      return <div style={{textAlign:'center'}}>
        <div>
          <Link.large onClick={() => this.setState({ isEditing: false })} style={{display:'inline-block',float:'left'}} color={color.blue}>Back</Link.large>
          <Link.large style={{display: 'inline-block',float:'right'}} color={color.green}>Save</Link.large>
        </div>
        <Textarea.extraLarge style={{textAlign:'center'}} placeholder={'Type Lesson Title'} />
        <div style={{width:'200px',margin:'0 auto'}}>
          <FileUploadLabel backgroundColor={state.backgroundColor} color={state.color}>
            {this.state.filename || state.text}
            <input type='file' style={{visibility: 'hidden'}} onChange={(e) => this.handleFiles(e.target.files)} />
          </FileUploadLabel>
        </div>
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
  height: 60px;
  line-height: 60px;
  margin-top: 25px;
  font-size: 1.5em;
  background-color: ${props => props.backgroundColor};
  color: ${props => props.color};
  transition-duration: 0.2s;
  border-radius: 5px;
  font-family: BrandonGrotesque;
  display: block;
`

export default LessonsDashboard;
