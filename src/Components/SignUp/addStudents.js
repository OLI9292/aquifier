import { Redirect } from 'react-router';
import React, { Component } from 'react';
import _ from 'underscore';

import Button from '../Common/button';
import { color } from '../../Library/Styles/index';
import Textarea from '../Common/textarea';

import {

} from './components';

const PLACEHOLDER = 'Copy/Paste your student names here. Put each name on a new line.' +
  '\n\nExamples:\n' +
  '\nFirst name Last Name'.repeat(3) +
  '\n\n-or-\n' +
  '\nLast Name, First name'.repeat(3);

class AddStudents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      students: []
    };
  }

  handleKeyPress(e) {
    const { name, students } = this.state;
    const invalid = (name.split(' ').length < 2) || _.contains(students, name);
    if (e.key !== 'Enter' || invalid) { return; }
    this.setState({ name: '', students: students.concat(name) })
  }  

  import() {
    const students = this.state.studentText.split('\n');
    this.props.setIsImporting(false);
    this.setState({ students: students });
  }

  render() {
    const {
      name,
      students
    } = this.state;

    const studentRow = student => <tr key={student}>
      <td>
        {student}
      </td>
      <td>
        <img
          onClick={() => this.setState({ students: _.without(students, student) })}
          style={{width:'20px',height:'20px',cursor:'pointer'}}
          src={require('../../Library/Images/exit-gray.png')} />
      </td>
    </tr>;

    const manualComponents = (() => {
      return <div>
        <div style={{display:'flex'}}>
          <span style={{flex:1}} />

          <p style={{fontSize:'1.5em',fontFamily:'BrandonGrotesqueBold',flex:2}}>
            Add Students
          </p>

          <p
            onClick={() => this.props.setIsImporting(true)}
            style={{fontSize:'1.5em',fontFamily:'BrandonGrotesqueBold',flex:1,color:color.blue,cursor:'pointer'}}>
            Import
          </p>          
        </div>

        <p style={{fontSize:'1.25em',margin:'20px 0px'}}>
          Start typing to add students!
        </p>

        <input
          onChange={e => this.setState({ name: e.target.value })}
          value={name}
          onKeyPress={this.handleKeyPress.bind(this)}
          placeholder={'First name last name'} />

        <table>
          <tbody>
            {_.map(students, studentRow)}
          </tbody>
        </table>   
      </div>
    })();

    const importComponents = (() => {
      return <div>
        <div style={{display:'flex',justifyContent:'space-between'}}>
          <p>
            Copy/Paste student list
          </p>
          <img
            onClick={() => this.props.setIsImporting(false)}
            style={{width:'20px',height:'20px',cursor:'pointer'}}
            src={require('../../Library/Images/exit-gray.png')} />
        </div>

        <p style={{fontSize:'1.25em',fontFamily:'BrandonGrotesqueBold'}}>
          Paste your student list
        </p>      

        <Textarea.default
          onChange={e => this.setState({ studentText: e.target.value })}
          placeholder={PLACEHOLDER}
          style={{width:'80%',margin:'0 auto',height:'300px'}} />

        <Button.medium
          style={{}} 
          onClick={this.import.bind(this)}>
          import list
        </Button.medium>          
      </div>;
    })();

    return this.props.isImporting ? importComponents : manualComponents;
  }
}

export default AddStudents
/*
<div style={{display:'flex',color:color.blue,width:'50%',margin:'0 auto',justifyContent:'space-between'}}>
          <p style={{cursor:'pointer'}}>
            Import from Word
          </p>
          <p style={{cursor:'pointer'}}>
            Import from Excel
          </p>          
        </div>
        */