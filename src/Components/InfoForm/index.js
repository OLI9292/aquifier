import Firebase from '../../Networking/Firebase';
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';

import Textarea from '../Common/textarea';
import { shouldRedirect } from '../../Library/helpers';
import InputStyles from '../Common/inputStyles';
import { Container } from '../Common/container';
import Header from '../Common/header';

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
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }

    const inputs = this.state.inputs.map((input, idx) => {
      return <input
        key={idx}
        type='text'
        style={_.extend({}, InputStyles.default, { display: 'block', margin: '15px 0px' })}
        name={input.name}
        placeholder={input.placeholder}
        ref={(input) => { this.inputs = _.union(this.inputs, [input]); }}
        onClick={() => this.setState({ focusedOn: idx })}
        onChange={this.handleInputChange.bind(this)} />
    });

    const description = (() => {
      return <p style={{lineHeight:'40px',fontSize:'1.25em',fontFamily:'EBGaramond',marginBottom:'40px'}}>
        <span>Bring the full</span>
        <span style={{color: color.yellow}}><b> WORDCRAFT </b></span>
        <span>curriculum to your school with progress tracking, test prep, in-class multiplayer games, and worldwide competition. Send us the following and we'll set you up right away.</span>
      </p>
    })()

    return (
      <ContainerExt>
        <Header.large style={{color:'black'}}>
          start free trial
        </Header.large>

        {description}
        
        <form onSubmit={this.handleSubmit.bind(this)}>

          {inputs}

          <Textarea.default
            style={{width:'100%',height:'200px',padding:'10px','fontSize':'1.25em'}}
            name='comments'
            placeholder='comments'
            onChange={(e) => this.setState({ comments: e.target.value })} />

          <SubmitButton
            type='submit'
            value='submit'
            valid={this.state.allValid} />

          <ErrorMessage success={this.state.success} show={this.state.displayError || this.state.success}>
            {this.state.success ? 'Submitted.  We\'ll be in touch soon!' : this.state.errorMessage}
          </ErrorMessage>
        </form>
      </ContainerExt>
    );
  }
}

const ContainerExt = Container.extend`
  box-sizing: border-box;
  padding: 20px 5% 20px 5%;
  text-align: left;
  margin-top: 70px;
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
  margin: 10px 0px;
`

const ErrorMessage = styled.p`
  color: ${props => props.success ? color.green : color.red};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
`

export default InfoForm;
