import React, { Component } from 'react';
import _ from 'underscore';

import Button from '../Common/button';
import { color } from '../../Library/Styles/index';
import Textarea from '../Common/textarea';
import InputStyles from '../Common/inputStyles';
import Header from '../Common/header';

import {
  BackArrow,
  ImportInformationContainer,
  ImportStudentListContainer,
  StudentCountCell,
  StudentCell,
  StudentsTable,
  TableContainer
} from './components';

const PLACEHOLDER = 'Copy/Paste your student names here. Put each name on a new line.' +
  '\n\nExample:\n' +
  '\nFirst name Last Name'.repeat(3);

class AddStudents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      studentText: PLACEHOLDER
    };
  }

  addStudent(key = 'Enter') {
    const name = this.state.name;
    const split = name.split(' ');
    
    const invalid = (split.length < 2) || 
      split[0].length === 0 || 
      split[1].length === 0 || 
      _.contains(this.props.students, name);

    if (key !== 'Enter' || invalid) { return; }
    this.setState({ name: '' }, () => this.props.updateStudents(name, 'add'));
  }  

  import() {
    let students = this.state.studentText.split('\n');
    this.props.setIsImporting(false);
    this.props.updateStudents(students, 'replace');
  }

  render() {
    const {
      name,
      studentText,
      focus
    } = this.state;

    const students = this.props.students;

    const studentCountRow = <tr>
      <StudentCountCell>
        {students.length === 1 ? '1 student' : `${students.length} students`}
      </StudentCountCell>
    </tr>;

    const studentRow = (student, last) => <tr
      key={student}
      style={{borderBottom:`${last ? 0 : 2}px solid ${color.lightGray}`}}>
      <StudentCell>
        {student}
        <img
          alt={"delete-student"}
          onClick={() => this.props.updateStudents(student, 'remove')}
          style={{width:'15px',height:'15px',cursor:'pointer'}}
          src={require('../../Library/Images/icon-exit-dark.png')} />        
      </StudentCell>
    </tr>;

    const manualComponents = (() => {
      const inputStyles = _.extend({},
        InputStyles.default,
        { width: '100%', color: color.mainBlue, borderColor: focus === 'add' ? color.mainBlue : color.lightGray });

      return <div>
        <Header.medium style={{margin:'40px 0px'}}>
          add students
        </Header.medium>

        <div style={{display:'flex',justifyContent:'space-between',width:'90%',margin:'0 auto'}}>
          <input
            onChange={e => this.setState({ name: e.target.value })}
            style={inputStyles}
            value={name}
            onKeyPress={e => this.addStudent(e.key)}
            onFocus={() => this.setState({ focus: 'add' })}
            onBlur={() => this.setState({ focus: null })}
            placeholder={'First name last name'} />
          <Button.small
            onClick={() => this.addStudent('Enter')}
            style={{height:'65px',borderRadius:'10px',marginLeft:'20px'}}>
            add
          </Button.small>
        </div>

        <TableContainer>
          <StudentsTable>
            {
              students.length > 0
              ?
              <tbody>
                {studentCountRow}
                {_.map(students, (student, idx) => studentRow(student, (idx === students.length - 1)))}
              </tbody>
              :
              <tbody><tr><td style={{height:'250px',color:color.gray2}}>
                No Students Added Yet
              </td></tr></tbody>
            }
          </StudentsTable>
        </TableContainer>

        <ImportStudentListContainer
          onClick={() => this.props.setIsImporting(true)}>
          <img
            alt={"download-icon"}
            style={{width:'25px',height:'25px'}}
            src={require('../../Library/Images/icon-download.png')} />
          <Header.small
            style={{color:color.green}}>
            or import student list
          </Header.small>              
        </ImportStudentListContainer>
      </div>
    })();

    const importComponents = (() => {
      return <div>
        <BackArrow
          alt={"back-arrow"}
          onClick={() => this.props.setIsImporting(false)}
          src={require('../../Library/Images/icon-back-arrow.png')} />        

        <Header.medium style={{margin:'40px 0px'}}>
          copy/paste student list
        </Header.medium>

        <div style={{width:'90%',margin:'0 auto'}}>
          <ImportInformationContainer>
            <img
              alt={"information-icon"}
              style={{width:'20px',height:'20px',marginRight:'10px'}}
              src={require('../../Library/Images/icon-information.png')} />
            Copy/Paste your students names here. Put each name on a new line.
          </ImportInformationContainer>

          <Textarea.medium
            onChange={e => this.setState({ studentText: e.target.value })}
            onBlur={e => { if (!studentText.length) { this.setState({ studentText: PLACEHOLDER }); } }}
            onFocus={e => { if (studentText === PLACEHOLDER) { this.setState({ studentText: '' }); } }}
            value={studentText}
            style={{backgroundColor:color.lightestGray,border:'0',borderRadius:'0px 0px 10px 10px',height:'300px'}} />
        </div>

        <Button.medium
          style={{margin:'40px 0px'}} 
          onClick={this.import.bind(this)}>
          import list
        </Button.medium>     
      </div>;
    })();

    return this.props.isImporting ? importComponents : manualComponents;
  }
}

export default AddStudents
