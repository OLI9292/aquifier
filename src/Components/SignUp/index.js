import { Redirect } from 'react-router';
import React, { Component } from 'react';
import _ from 'underscore';
import get from 'lodash/get';

import { DarkBackground } from '../Common/darkBackground';
import Button from '../Common/button';
import Form from './form';
import AddStudents from './addStudents';

import {
  BackArrow,
  Container,
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
        schoolZip: '',
        schoolName: ''
      }
    };
  }

  updated(key, value) {
    const data = this.state.data;
    if (_.has(data, key)) { data[key] = value; }
    this.setState({ data });
  }

  back() {
    this.setState({ currentStep: this.state.currentStep - 1 });
  }

  next() {
    this.setState({ currentStep: this.state.currentStep + 1 });
  }

  render() {
    const {
      currentStep,
      data,
      isImporting
    } = this.state;

    const step = num => <Step
      key={num}
      selected={num === currentStep}>
      {num}
    </Step>;

    const addStudentsComponent = <AddStudents
      isImporting={isImporting}
      setIsImporting={bool => this.setState({ isImporting: bool })} />;

    const content = (() => {
      if (currentStep === 4) { return addStudentsComponent; }

      const formType = {
        1: 'email',
        2: 'account',
        3: 'other'
      }[currentStep];

      return <Form
        data={data}
        updated={this.updated.bind(this)}
        type={formType} />
    })();

    return (
      <div>
        <DarkBackground onClick={() => this.props.displaySignUp(false)} />

        <Container style={{textAlign:'center'}}>

          <BackArrow
            hide={isImporting || currentStep === 1}
            onClick={this.back.bind(this)}
            src={require('../../Library/Images/icon-back-arrow.png')} />        

          <StepsContainer hide={isImporting}>
            {_.map([1,2,3,4], step)}
          </StepsContainer>

          {content}

          <Button.medium
            style={{display:isImporting ? 'none' : 'inline-block'}} 
            onClick={this.next.bind(this)}>
            {currentStep === 4 ? 'finish' : 'next'}
          </Button.medium>
        </Container>
      </div>
    )
  }
}

export default SignUp
