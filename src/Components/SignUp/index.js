import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import { Redirect } from 'react-router';
import React, { Component } from 'react';
import _ from 'underscore';
import get from 'lodash/get';

import Firebase from '../../Networking/Firebase';
import { DarkBackground } from '../Common/darkBackground';
import LoadingSpinner from '../Common/loadingSpinner';
import { ModalContainer } from '../Common/modalContainer';
import LocalStorage from '../../Models/LocalStorage'
import Button from '../Common/button';
import Form from './form';
import AddStudents from './addStudents';
import { shouldRedirect } from '../../Library/helpers';
import { color } from '../../Library/Styles/index';

import { createClassAction } from '../../Actions/index';

import {
  BackArrow,
  MobileExit,
  Step,
  StepsContainer  
} from './components';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 1,
      isImporting: false,
      data: {
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        role: '',
        isTeacher: true,
        schoolZip: '',
        schoolName: '',
        students: []
      }
    };
  }

  updated(key, value) {
    const data = this.state.data;
    if (_.has(data, key)) { data[key] = value; }
    this.setState({ data });
  }

  updateStudents(students, operation) {
    const data = this.state.data;
    if (operation === 'add')     { data.students = data.students.concat(students); }
    if (operation === 'remove')  { data.students = _.without(data.students, students); }
    if (operation === 'replace') { data.students = students; }
    this.setState({ data });
  }

  back() {
    this.setState({ currentStep: this.state.currentStep - 1, error: null });
  }

  createClassParams(data) {
    const nameObj = str => ({ firstName: str.split(' ')[0], lastName: _.rest(str.split(' ')).join(' ') });
    const students = _.filter(_.map(data.students, nameObj), obj => obj.firstName.length);
    const teacher = _.omit(data, 'role', 'schoolZip', 'schoolName', 'students');
    return students.concat(teacher);
  }

  slackMessage(data) {
    return `${data.firstName} ${data.lastName} ` +
    `(Role: ${get(data, 'role')}, School: ${get(data, 'schoolName')}) ` +
    `signed up a class of ${data.students.length}.`;
  }

  createClass = async data => {
    const error = this.validate(4, data);
    if (error) { this.setState({ error }); return; }

    // Send sign up info to Firebase for Slack to pick up
    Firebase.sendForm(_.extend({}, data, { message: this.slackMessage(data), date: Date.now() }));

    // Set isNetworking so spinner runs
    this.setState({ isNetworking: true });

    // Set key in sessionStorage so success redirect goes to /welcome
    sessionStorage.setItem('justSignedUp', 'true');
    const result = await this.props.dispatch(createClassAction(this.createClassParams(data)));
    this.setState({ isNetworking: false });

    if (result.error) {
      this.setState({ error: result.error.includes('email_1 dup key')
        ? 'Email already exists.'
        : 'Error creating class.' }); 
    } else if (result.response.entities) {
      LocalStorage.setSession(result.response.entities.session);
    }
  }

  next() {
    const { currentStep, data, isNetworking } = this.state;
    if (currentStep === 4 && !isNetworking) {
      this.createClass(data);
    } else {
      const error = this.validate(currentStep, data);
      const state = error ? { error: error } : { currentStep: currentStep + 1, error: undefined };
      this.setState(state);      
    }
  }

  validate(step, data) {
    const { email, firstName, lastName, password, students } = data;
    
    if (step === 1 && (/\S+@\S+\.\S+/.test(email) === false)) {
      return 'Please enter a valid email.';
    }

    if (step === 2) {
      if (!firstName)             { return 'Please enter a first name.'; }
      if (!lastName)              { return 'Please enter a last name.'; }
      if (password.length < 8 ||
          password.length > 20)   { return 'Password must be between 8 and 20 characters.'; }
    }

    if (step === 4) {
      if (students.length < 2)    { return 'At least 2 students are required to create a class.'; }
      if (students.length > 35)   { return 'Max class size is 35.'; }
    }
  }

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }
    
    const {
      currentStep,
      data,
      error,
      isImporting,
      isNetworking
    } = this.state;

    const step = num => <Step
      key={num}
      selected={num === currentStep}>
      {num}
    </Step>;

    const addStudentsComponent = <AddStudents
      updateStudents={this.updateStudents.bind(this)}
      isImporting={isImporting}
      students={this.state.data.students}
      setIsImporting={bool => this.setState({ isImporting: bool })} />;

    const content = (() => {
      if (currentStep === 4) { return addStudentsComponent; }

      const formType = {
        1: 'email',
        2: 'account',
        3: 'other'
      }[currentStep];

      return <Form
        submit={this.next.bind(this)}
        data={data}
        updated={this.updated.bind(this)}
        type={formType} />
    })();

    return isNetworking
    ?
    <LoadingSpinner />
    :
    <div>
      <DarkBackground
        onClick={() => this.props.displaySignUp(false)} />
        
      <ModalContainer style={{textAlign:'center'}}>
        <BackArrow
          hide={isImporting || currentStep === 1}
          onClick={this.back.bind(this)}
          src={require('../../Library/Images/icon-back-arrow.png')} />        

        <MobileExit
          src={require('../../Library/Images/exit-gray.png')}
          onClick={() => this.props.displaySignUp(false)}/>            

        <StepsContainer hide={isImporting}>
          {_.map([1,2,3,4], step)}
        </StepsContainer>

        {content}

        <Button.medium
          style={{display:isImporting ? 'none' : 'inline-block',margin:'20px 0px 20px 0px'}} 
          onClick={this.next.bind(this)}>
          {currentStep === 4 ? 'finish' : 'next'}
        </Button.medium>

        {
          currentStep === 1 &&
          <p>
            By signing up, you agree to our <Link to={'/terms'}>Terms of Service</Link> and <Link to={'/privacy'}>Privacy Policy</Link>
          </p>
        }        

        <p style={{margin:'0px 0px 20px 0px',color:color.red}}>
          {error}
        </p>
      </ModalContainer>
    </div>;
  }
}

export default connect()(SignUp)
