import Firebase from '../../Networking/Firebase';
import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';

import TextArea from '../Common/textarea';
import lightGrayCheckmark from '../../Library/Images/Checkmark-LightGray.png';
import greenCheckmark from '../../Library/Images/Checkmark-Green.png';
import { color } from '../../Library/Styles/index';

class InfoForm extends Component {
  constructor(props) {
    super(props);

    const smallInputs = [
      { name: 'firstName', placeholder: 'first name', value: '' },
      { name: 'lastName', placeholder: 'last name', value: '' },
      { name: 'email', placeholder: 'email address', value: '' },
      { name: 'school', placeholder: 'school', value: '' }
    ]

    this.state = {
      allValid: false,
      comments: '',
      displayError: false,
      errorMessage: null,
      smallInputs: smallInputs,
      success: false
    }

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  formInput() {
    let obj = {};
    this.state.smallInputs.forEach((i) => obj[i.name] = i.value );
    obj.comments = this.state.comments;
    obj.date = Date.now();
    return obj;
  }

  handleInputChange(event) {
    const updatedInputs = this.state.smallInputs.map((i) => {
      return i.name === event.target.name
        ? { name: i.name, placeholder: i.placeholder, value: event.target.value }
        : i
    });

    const allValid = _.isUndefined(this.invalidField());
    this.setState({ smallInputs: updatedInputs, allValid: allValid, displayError: !allValid });
  }

  invalidField() {
    return _.find(this.state.smallInputs, (input) => !this.isValid(input));
  }

  isValid(input) {
    return input.name === "email"
      ? this.isValidEmail(input.value)
      : input.value.length > 3
  }

  isValidEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    if (this.state.success) {
      return;
    }
    
    const invalid = this.invalidField();

    if (invalid) {
      const errorMessage = invalid.name === 'email'
        ? 'Please enter a valid email'
        : `${invalid.placeholder} must be longer than 4 characters`
      this.setState({ displayError: true, errorMessage: errorMessage });
      return;
    }

    const inputs = this.formInput();
    const success = await Firebase.sendForm(inputs);
    success
      ? this.setState({ success: true })
      : this.setState({ displayError: true, errorMessage: 'Could not process form' });
  }

  render() {
    const smallInputs = this.state.smallInputs.map((input, idx) => {
      return <SmallInput key={idx}>
        <Image src={this.isValid(input) ? greenCheckmark : lightGrayCheckmark} className="checkmark" />
        <TextArea.medium
          name={input.name}
          placeholder={input.placeholder}
          onChange={this.handleInputChange.bind(this)} />
      </SmallInput>
    });

    return (
      <Layout>
        <Text>To bring the full <span style={{color: color.yellow}}><b>WORDCRAFT</b></span> curriculum to your school, send us the following information and we'll be in touch as soon as possible.</Text>
        <form onSubmit={this.handleSubmit}>
          <InputsContainer>
            {smallInputs}
          </InputsContainer>
          <CommentsTextArea name="comments" placeholder="comments" onChange={(e) => this.setState({ comments: e.target.value })} />
          <SubmitButton valid={this.state.allValid} type="submit" value="submit" />
          <ErrorMessage success={this.state.success} display={this.state.displayError || this.state.success}>
            {this.state.success ? 'Submitted.  We\'ll be in touch soon!' : this.state.errorMessage}
          </ErrorMessage>
        </form>
      </Layout>
    );
  }
}

const Layout = styled.div`
  margin-left: 10%;
  width: 80%;
`

const Text = styled.p`
  font-size: 1.75em;
  color: ${color.darkGray};
  line-height: 40px;

  @media (max-width: 1100px) {
    font-size: 1.2em;
    line-height: 30px;
    margin-top: 20px;
  }

  @media (max-width: 450px) {
    font-size: 0.9em;
  }
`

const Image = styled.img`
  height: 40px;
  padding: 10px 5px 10px 0px;
  width: auto;

  @media (max-width: 768px) {
    height: 30px;
  }

  @media (max-width: 480px) {
    height: 20px;
  }
`

const SmallInput = styled.div`
  margin: 1%;
`

const InputsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`

const CommentsTextArea = TextArea.medium.extend`
  width: 80%;
  height: 150px;
  margin-left: 10%;
  margin-top: 2%;
  line-height: 1.5;
`

const SubmitButton = styled.input`
  &:focus {
    outline: 0;
  }
  display: block;
  background-color: ${props => props.valid ? color.green : '#f1f1f1'};
  border: none;
  border-radius: 5px;
  font-family: BrandonGrotesque;
  font-size: 1.25em;
  color: ${props => props.valid ? 'white' : '#757575'};
  padding: 0px 20px 0px 20px;
  height: 50px;
  cursor: pointer;
  transition: 0.2s;
  margin-left: 10%;
  margin-top: 2%;

  @media (max-width: 768px) {
    font-size: 1em;
  }

  @media (max-width: 450px) {
    font-size: 0.9em;
  }
`

const ErrorMessage = styled.p`
  font-size: 1.25em;
  position: relative;
  padding-left: 10%;
  color: ${props => props.success ? color.green : color.red};  
  visibility: ${props => props.display ? 'visible' : 'hidden'}

  @media (max-width: 1100px) {
    font-size: 1em;
  }

  @media (max-width: 450px) {
    font-size: 0.75em;
  }
`

export default InfoForm;
