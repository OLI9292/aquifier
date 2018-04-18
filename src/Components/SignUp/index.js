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
import Header from '../Common/header';
import Form from './form';
import AddStudents from './addStudents';
import { shouldRedirect } from '../../Library/helpers';
import { color } from '../../Library/Styles/index';

import {
  createClassAction,
  createUserAction
} from '../../Actions/index';

import {
  BackArrow,
  MobileExit,
  Step,
  StepsContainer,
  UserTypeButton,
  UserTypeText
} from './components';

const USER_TYPES = [
  { 
    name: "Teacher",
    color: color.warmYellow,
    darkColor: "#c18602",
    image: "teacher-icon.png"
  },
  { 
    name: "Individual",
    color: color.red,
    darkColor: "#dd3737",
    image: "individual-icon.png"
  },
  { 
    name: "Administator",
    color: color.babyBlue,
    darkColor: "#3f81e6",
    image: "administrator-icon.png"
  }
];

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 0,
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

  slackMessage(data, teacher = true) {
    return teacher
      ? 
      `${data.firstName} ${data.lastName} ` +
      `(Role: ${get(data, 'role')}, School: ${get(data, 'schoolName')}) ` +
      `signed up a class of ${data.students.length}.`
      :
      `${data.firstName} ${data.lastName} just signed up.`;
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
    const params = this.createClassParams(data);
    const result = await this.props.dispatch(createClassAction(params));
    this.setState({ isNetworking: false });

    if (result.error) {
      this.setState({ error: result.error.includes('email_1 dup key')
        ? 'Email already exists.'
        : 'Error creating class.' }); 
    } else if (result.response.entities) {
      LocalStorage.setSession(result.response.entities.session);
    }
  }

  createIndividual = async data => {
    const error = this.validate("individual", data);
    if (error) { this.setState({ error }); return; }

    return

    Firebase.sendForm(_.extend({}, data, { message: this.slackMessage(data, false), date: Date.now() }));

    this.setState({ isNetworking: true });

    const params = _.extend(_.pick(data, ["firstName", "lastName", "email", "password"]), { signUpMethod: "individualSignUp" });

    if (window.location.search.includes("?r=")) { params.referrer = window.location.search.replace("?r=",""); }

    const result = await this.props.dispatch(createUserAction(params));
    this.setState({ isNetworking: false });

    if (result.error) {
      this.setState({ error: result.error.includes('email_1 dup key')
        ? 'Email already exists.'
        : 'Error creating user.' }); 
    } else if (result.response.entities) {
      LocalStorage.setSession(result.response.entities.session);
    }
  }

  next() {
    const { 
      currentStep,
      data,
      isNetworking
    } = this.state;

    if (currentStep === 4 && !isNetworking) {
      if (isNetworking) { return; }
      this.createClass(data);
    } else if (currentStep === "individual") {
      if (isNetworking) { return; }
      this.createIndividual(data);
    } else {
      const error = this.validate(currentStep, data);
      const state = error ? { error: error } : { currentStep: currentStep + 1, error: undefined };
      this.setState(state);      
    }
  }

  signUpAs(role) {
    if (role === "Teacher") {
      this.setState({ currentStep: 1 });
    } else if (role === "Individual") {
      this.setState({ currentStep: "individual" });
    } else if (role === "Administator") {
      this.setState({ redirect: "/start-free-trial"});
    }
  }

  validate(step, data) {
    const { email, firstName, lastName, password, students } = data;
    
    if ([1, "individual"].includes(step) && (/\S+@\S+\.\S+/.test(email) === false)) {
      return 'Please enter a valid email.';
    }

    if ([2, "individual"].includes(step)) {
      if (!firstName)             { return 'Please enter a first name.'; }
      if (!lastName)              { return 'Please enter a last name.'; }
      if (password.length < 8 ||
          password.length > 20)   { return 'Password must be between 8 and 20 characters.'; }
    }

    if (step === 4) {
      if (students.length < 2)    { return 'At least 2 students are required to create a class.'; }
      if (students.length > 35)   { return 'Max class size is 35.'; }
    }

    if (step === "individual" && window.location.search.includes("?r=")) {
      // For hackerz
      const referrer = window.location.search.replace("?r=","");
      const loggedOutUser = LocalStorage.getUserId();
      if (referrer === loggedOutUser) {
        return 'Please use the referral link to sign up a new user.';
      }
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

    const userTypeButton = (name, color, darkColor, image) => <UserTypeButton
      color={color}
      key={name}
      onClick={() => this.signUpAs(name)}>
      <img
        style={{width:"80%",height:"auto",marginTop:"35px"}}
        src={require(`../../Library/Images/${image}`)} />
      <UserTypeText color={darkColor}>
        {name}
      </UserTypeText>
    </UserTypeButton>;

    const userTypeComponent = <div>
      <Header.small>
        wordcraft
      </Header.small>

      <p style={{fontSize:"1.3em"}}>
        Sign up for Wordcraft as a...
      </p>

      <div style={{display:"flex",justifyContent:"space-around",width:"95%",margin:"0 auto"}}>
        {_.map(USER_TYPES, data => userTypeButton(..._.values(data)))}
      </div>
    </div>;

    const addStudentsComponent = <AddStudents
      updateStudents={this.updateStudents.bind(this)}
      isImporting={isImporting}
      students={this.state.data.students}
      setIsImporting={bool => this.setState({ isImporting: bool })} />;

    const content = (() => {
      if (currentStep === 0) { return userTypeComponent; }
      if (currentStep === 4) { return addStudentsComponent; }

      const formType = {
        0: 'userType',
        1: 'email',
        2: 'account',
        3: 'other',
        individual: "individual"
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
          hide={isImporting || [0, "individual"].includes(currentStep)}
          onClick={this.back.bind(this)}
          src={require('../../Library/Images/icon-back-arrow.png')} />        

        <MobileExit
          src={require('../../Library/Images/exit-gray.png')}
          onClick={() => this.props.displaySignUp(false)}/>            

        <StepsContainer hide={isImporting || [0, "individual"].includes(currentStep)}>
          {_.map([1,2,3,4], step)}
        </StepsContainer>

        {content}

        <Button.medium
          style={{display:(isImporting || currentStep === 0) ? 'none' : 'inline-block',margin:'20px 0px 20px 0px'}} 
          onClick={this.next.bind(this)}>
          {[4, "individual"].includes(currentStep) ? 'finish' : 'next'}
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
