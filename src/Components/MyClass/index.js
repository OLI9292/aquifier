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
import StudentsTable from './studentsTable';
import SEED_STUDENTS from './seedStudents';

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
    const {
      user,
      newStudents,
      session
    } = this.props;

    const id = get(_.find(user.classes, c => c.role === 'teacher'), "id");
    const data = { students: _.map(newStudents, this.nameObj), email: user.email };
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
      showSuccess
    } = this.state;

    const showDistrictAdminView = get(this.props.user, "email") === "oliver@playwordcraft.com";
    
    const students = showDistrictAdminView
      ? this.props.students.concat(SEED_STUDENTS)
      : this.props.students;

    return (
      <Container>
        <Header.medium>
          {showDistrictAdminView ? 'federal way district' : 'my class'}
        </Header.medium>

        <div style={{display:addingStudents ? "" : "none"}}>
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

        <StudentsTable
          showDistrictAdminView={showDistrictAdminView}
          students={students} />

        {!showDistrictAdminView && <Header.small
          onClick={this.addStudents.bind(this)}
          style={{color:color.green,textAlign:"left",marginLeft:"5%",cursor:"pointer"}}>
          + add students
        </Header.small>}
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
