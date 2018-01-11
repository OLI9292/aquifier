import Firebase from '../../Networking/Firebase';
import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';

import Textarea from '../Common/textarea';
import InputStyles from '../Common/inputStyles';
import Heading from '../Common/heading';
import Container from '../Common/container';
import lightGrayCheckmark from '../../Library/Images/Checkmark-LightGray.png';
import greenCheckmark from '../../Library/Images/Checkmark-Green.png';
import { color } from '../../Library/Styles/index';

class InfoForm extends Component {
  constructor(props) {
    super(props);

    const inputs = [
      { name: 'firstName', placeholder: 'first name', value: '' },
      { name: 'lastName', placeholder: 'last name', value: '' },
      { name: 'email', placeholder: 'email address', value: '' },
      { name: 'school', placeholder: 'school', value: '' }
    ]

    this.state = {
      allValid: false,
      focusedOn: -1,
      comments: '',
      displayError: false,
      errorMessage: null,
      inputs: inputs,
      success: false
    }

    this.handleKeydown = this.handleKeydown.bind(this);
  }

  componentDidMount() {
    document.body.addEventListener('keydown', this.handleKeydown);
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.handleKeydown);
  }  

  handleKeydown(event) {
    if (event.key === 'Enter' && _.contains(_.range(5), this.state.focusedOn)) {
      event.preventDefault();

      this.state.focusedOn === 3
        ? this.handleSubmit()
        : this.switchFocusTo(this.state.focusedOn + 1);
    }
  }

  switchFocusTo(idx) {
    this.inputs[idx].focus();
    this.setState({ focusedOn: idx });    
  }

  formInput() {
    let obj = {};
    this.state.inputs.forEach((i) => obj[i.name] = i.value );
    obj.comments = this.state.comments;
    obj.date = Date.now();
    return obj;
  }

  handleInputChange(event) {
    const updatedInputs = this.state.inputs.map((i) => {
      return i.name === event.target.name
        ? { name: i.name, placeholder: i.placeholder, value: event.target.value }
        : i
    });

    const allValid = _.isUndefined(this.invalidField());
    this.setState({ inputs: updatedInputs, allValid: allValid, displayError: !allValid });
  }

  invalidField() {
    return _.find(this.state.inputs, (input) => !this.isValid(input));
  }

  isValid(input) {
    return input.name === "email"
      ? this.isValidEmail(input.value)
      : input.value.length > 2
  }

  isValidEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  handleSubmit = async (event) => {
    if (event) { event.preventDefault(); }

    if (this.state.success) { return; }

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
    const inputs = this.state.inputs.map((input, idx) => {
      return <div style={{margin:'1%'}} key={idx}>
        <img
          alt='checkmark'
          className='checkmark'
          src={this.isValid(input) ? greenCheckmark : lightGrayCheckmark}
          style={{height:'50px',width:'auto',marginRight:'5px'}}/>
        <input
          type='text'
          style={_.extend({}, InputStyles.default, {'verticalAlign':'top'})}
          name={input.name}
          placeholder={input.placeholder}
          ref={(input) => { this.inputs = _.union(this.inputs, [input]); }}
          onClick={() => this.setState({ focusedOn: idx })}
          onChange={this.handleInputChange.bind(this)} />
      </div>
    });

    return (
      <Container>
      <Heading color={color.green}>
        START FREE TRIAL
      </Heading>
        <div style={{width:'90%',margin:'0 auto'}}>
          <Text>Bring the full <span style={{color: color.yellow}}><b>WORDCRAFT</b></span> curriculum to your school with progress tracking, test prep, in-class multiplayer games, and worldwide competition. Send us the following and we'll set you up right away.</Text>
          <form onSubmit={this.handleSubmit.bind(this)}>
            <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center'}}>
              {inputs}
              <Textarea.default
                style={{width:'80%',height:'200px',float:'left',padding:'10px','fontSize':'1.25em'}}
                name='comments'
                placeholder='comments'
                onChange={(e) => this.setState({ comments: e.target.value })} />
            </div>
            <SubmitButton valid={this.state.allValid} type='submit' value='submit' />
            <ErrorMessage success={this.state.success} show={this.state.displayError || this.state.success}>
              {this.state.success ? 'Submitted.  We\'ll be in touch soon!' : this.state.errorMessage}
            </ErrorMessage>
          </form>
        </div>
      </Container>
    );
  }
}

const Text = styled.p`
  line-height: 40px;
  font-size: 1.5em;
  color: ${color.darkGray};
  @media (max-width: 1100px) {
    line-height: 30px;
    text-align: left !important;
    font-size: 1.2em;
  }
  @media (max-width: 450px) {
    font-size: 0.9em;
  }
`

// TODO: - move to inputStyles.js
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
  visibility: ${props => props.show ? 'visible' : 'hidden'}

  @media (max-width: 1100px) {
    font-size: 1em;
  }

  @media (max-width: 450px) {
    font-size: 0.75em;
  }
`

export default InfoForm;
