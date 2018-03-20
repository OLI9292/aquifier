import { Redirect } from 'react-router';
import React, { Component } from 'react';
import _ from 'underscore';
import get from 'lodash/get';

import { color } from '../../Library/Styles/index';
import InputStyles from '../Common/inputStyles';

import {
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
  }

  render() {
    const {
      data,
      type
    } = this.props;
    
    const headerText = {
      email: 'What\'s Your Email?',
      account: 'Create Your Account',
      other: 'Tell Us About You'
    }[type];

    const input = (key, placeholder, autocapitalize, long) => {
      const width = long ? '300px' : '140px';
      return <input
        value={data[key]}
        style={_.extend({}, InputStyles.default, { width: width })}
        placeholder={placeholder} 
        autoCapitalize={autocapitalize ? 'words' : 'none'}
        type={key === 'password' ? 'password' : 'text'}
        onChange={e => this.props.updated(key, e.target.value)} />      
    }

    const emailContent = input('email', 'you@yourschool.edu', false, true);

    const accountContent = (() => {
      return <div>
        <div>
          <div>
            First Name
            {input('firstName', 'Jane', true, false)}
          </div>
          <div>
            Last Name
            {input('lastName', 'Smith', true, false)}
          </div>          
        </div>
        {input('password', 'set password (at least 8 characters)', false, true)}
      </div>
    })();

    const otherContent = (() => {
      return <div>
        <div>
          <select
            onChange={e => this.props.updated('role', e.target.value)}
            value={data['role']}>
            {_.map(ROLES, role => <option key={role}>{role}</option>)}
          </select>
          <div>
            School
            {input('schoolName', 'school name', true, false)}
          </div>          
          <div>
            School Zip
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
      <form>
        <p style={{fontSize:'1.5em',fontFamily:'BrandonGrotesqueBold'}}>
          {headerText}
        </p>
        
        {content}
      </form>
    );
  }
}

export default Form
