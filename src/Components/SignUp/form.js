import { Redirect } from 'react-router';
import React, { Component } from 'react';
import _ from 'underscore';
import get from 'lodash/get';

import { color } from '../../Library/Styles/index';
import InputStyles from '../Common/inputStyles';
import Header from '../Common/header';

import {
  InputTitle
} from './components';

const ROLES = [
  'Teacher',
  'Instructional Coach',
  'Library Media Specialist',
  'Purchasing Secretary',
  'School Administrator',
  'District Administrator',
  'Other School Employee',
  'Parent / Homeschool'
]

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleKeydown = this.handleKeydown.bind(this);
  }
  
  componentDidMount() {
    document.body.addEventListener('keydown', this.handleKeydown);
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.handleKeydown);
  }    

  handleKeydown(event) {
    if (event.key === 'Enter') { this.props.submit(); }
  }

  render() {
    const { data, type } = this.props;
    const { focused } = this.state;
    
    const headerText = {
      email: 'what\'s your email?',
      account: 'create your account',
      other: 'tell us about you'
    }[type];

    const input = (key, placeholder, autocapitalize, long) => {
      const width = long ? '380px' : '180px';
      const borderColor = focused === key ? color.mainBlue : color.lightGray;
      const styles = _.extend({}, InputStyles.default, { width: width, color: color.mainBlue, borderColor: borderColor });
      return <input
        value={data[key]}
        style={styles}
        placeholder={placeholder} 
        autoCapitalize={autocapitalize ? 'words' : 'none'}
        type={key === 'password' ? 'password' : 'text'}
        onChange={e => this.props.updated(key, e.target.value)}
        onFocus={() => this.setState({ focused: key })} />      
    }

    const inputTitle = (attr, title, show) => (focused === attr || show) && <InputTitle>{title}</InputTitle>

    const emailContent = input('email', 'you@yourschool.edu', false, true);

    const accountContent = (() => {
      return <div style={{width:'380px',margin:'0 auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'25px'}}>
          <div style={{position:'relative'}}>
            {inputTitle('firstName', 'first name')}
            {input('firstName', 'First Name', true, false)}
          </div>

          <div style={{position:'relative'}}>
            {inputTitle('lastName', 'last name')}
            {input('lastName', 'Last Name', true, false)}
          </div>          
        </div>

        <div style={{position:'relative'}}>
          {inputTitle('password', 'password')}
          {input('password', 'set password (at least 8 characters)', false, true)}
        </div>
      </div>
    })();

    const otherContent = (() => {
      return <div style={{width:'380px',margin:'0 auto'}}>
        <div style={{display:'flex',marginBottom:'25px',position:'relative'}}>
          {inputTitle('role', 'role', true)}
          <select
            style={{width:'100%'}}
            onChange={e => this.props.updated('role', e.target.value)}
            value={data['role']}>
            {_.map(ROLES, role => <option key={role}>{role}</option>)}
          </select>
        </div>

        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'25px'}}>
          <div style={{position:'relative'}}>
            {inputTitle('schoolName', 'school name')}
            {input('schoolName', 'school name', true, false)}
          </div>

          <div style={{position:'relative'}}>
            {inputTitle('schoolZip', 'school zip')}
            {input('schoolZip', '#####', true, false)}
          </div>          
        </div>          
      </div>
    })();    

    const content = {
      email: emailContent,
      account: accountContent,
      other: otherContent
    }[type];

    return (
      <form onSubmit={e => e.preventDefault()}>
        <Header.medium style={{margin:'40px 0px'}}>
          {headerText}
        </Header.medium>
        
        {content}
      </form>
    );
  }
}

export default Form
