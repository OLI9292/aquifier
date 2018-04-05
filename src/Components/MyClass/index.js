import { connect } from 'react-redux'
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';
import get from 'lodash/get';

import Button from '../Common/button';
import { color } from '../../Library/Styles/index';
import { shouldRedirect, sum } from '../../Library/helpers';
import { ModalContainer } from '../Common/modalContainer';
import { DarkBackground } from '../Common/darkBackground';
import { Container } from '../Common/container';
import Header from '../Common/header';
import AddStudents from '../SignUp/addStudents';

import {
  Row,
  Table,
  TableCell
} from './components'

import {
  fetchStudentsAction,
  updateClassAction
} from '../../Actions/index';

class MyClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newStudents: [],
      isImporting: false,
    }
  }

  componentDidMount() {
    if (_.isEmpty(this.props.students)) { this.loadClass(this.props); }
  }  

  componentWillReceiveProps(nextProps) {
    if (_.isEmpty(nextProps.students)) { this.loadClass(nextProps); }
  }

  loadClass(props) {
    const id = props.user && get(_.find(props.user.classes, (c) => c.role === 'teacher'), "id");
    if (id) { this.props.dispatch(fetchStudentsAction(id)); }
  }

  sortStudents(attr) {
    let students = _.sortBy(this.props.students, attr);
    if (attr !== 'name') { students = students.reverse() };
    this.setState({ students })
  }

  handleStudentClick(student) {
    const redirect = '/profile/' + student.id;
    this.setState({ redirect });
  }

  updateStudents(students, operation) {
    let newStudents = this.state.newStudents;
    newStudents = {
      "add": newStudents.concat(students),
      "remove": _.without(newStudents, students),
      "replace": students
    }[operation];
    this.setState({ newStudents });
  }

  nameObj(str) {
    return { firstName: str.split(' ')[0], lastName: _.rest(str.split(' ')).join(' ') };
  } 

  addStudents() {
    this.setState({
      addingStudents: true,
      newStudents: [],
      error: null,
      showSuccess: false
    })
  }

  createStudents = async () => {
    const id = get(_.find(this.props.user.classes, (c) => c.role === 'teacher'), "id");
    const session = this.props.session;
    const data = {
      students: _.map(this.state.newStudents, this.nameObj),
      email: this.props.user.email
    };

    if (!id || !session || _.isEmpty(data.students) || !data.email) { return; }    
    const result = await this.props.dispatch(updateClassAction(id, data, session));

    if (result.error) {
      this.setState({ error: "Error uploading students." });
    } else {
      this.setState({ showSuccess: true });
      this.loadClass(this.props);      
    }
  }

  render() {
    const {
      addingStudents,
      error,
      isImporting,
      newStudents,
      redirect,
      showSuccess
    } = this.state;

    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={redirect} />; }

    const students = _.map(this.props.students, data => ({
      id: data._id,
      name: data.firstName + ' ' + data.lastName.charAt(0),
      wordsLearned: data.words.length,
      timePlayed: Math.ceil(sum(data.words, 'timeSpent')/60)
    }));

    const average = attr => parseInt(sum(students, attr)/students.length, 10);

    return (
      <Container>
        <Header.medium>
          my class
        </Header.medium>

        {
          addingStudents &&
          <div>
            <ModalContainer>
              {
                showSuccess
                ?
                <p style={{marginTop:"100px"}}>
                  Please check your email for new student account logins.
                </p>
                :
                <div>
                  <AddStudents
                    isImporting={isImporting}              
                    setIsImporting={bool => this.setState({ isImporting: bool })}
                    updateStudents={this.updateStudents.bind(this)}
                    students={newStudents} />
                  <p style={{margin:'0px 0px 20px 0px',color:color.red}}>
                    {error}
                  </p>
                </div>
              }
              <Button.medium
                style={{display:isImporting ? 'none' : 'inline-block',margin:'20px 0px 20px 0px'}} 
                onClick={() => showSuccess
                  ? this.setState({ addingStudents: false })
                  : this.createStudents()}>
                {showSuccess ? "ok" : "finish"}
              </Button.medium>                
            </ModalContainer>
            <DarkBackground
              onClick={() => this.setState({ addingStudents: false })} />
        </div>
        }

        {
          !_.isEmpty(students) &&
          <div>
            <Table>
              <tbody>
                <Row>
                  <TableCell left header onClick={() => this.sortStudents('name')}>NAME</TableCell>
                  <TableCell header onClick={() => this.sortStudents('wordsLearned')}>WORDS LEARNED</TableCell>
                  <TableCell right header onClick={() => this.sortStudents('timePlayed')}>TIME PLAYED</TableCell>
                </Row>
              
                <Row holistic>
                  <TableCell holistic left>Class Average</TableCell>
                  <TableCell holistic>{average('wordsLearned')}</TableCell>
                  <TableCell holistic right>{`${average('timePlayed')}m`}</TableCell>
                </Row>
                
                {_.map(students, (student, i) => <Row
                    dark={i % 2 === 0}
                    key={i}
                    onClick={() => this.handleStudentClick(student)}>
                    <TableCell left>{student.name}</TableCell>
                    <TableCell>{student.wordsLearned}</TableCell>
                    <TableCell right>{`${student.timePlayed}m`}</TableCell>
                 </Row>
                )}
              </tbody>
            </Table>
            <Header.small
              onClick={this.addStudents.bind(this)}
              style={{color:color.green,textAlign:"left",marginLeft:"5%",cursor:"pointer"}}>
              + add students
            </Header.small>              
          </div>
        }
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  session: state.entities.session,
  students: _.values(state.entities.students),
  user: _.first(_.values(state.entities.user))
})

export default connect(mapStateToProps)(MyClass)
