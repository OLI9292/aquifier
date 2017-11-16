import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';

import { color } from '../../Library/Styles/index';
import User from '../../Models/User';
import Class from '../../Models/Class';
import { sum } from '../../Library/helpers';

class ClassesDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: null,
      students: [],
      redirect: null
    }
  }

  componentDidMount() {
    this.loadUser()
  }

  loadUser = async () => {
    const userId = localStorage.getItem('userId');

    const query = { type: 'id', value: userId };
    let result = await User.fetch(query);

    if (_.has(result.data, 'user')) {
      const user = result.data.user;
      const title = this.formatName(user);
      this.setState({
        title: title
      }, this.loadClass)
    }
  }

  formatName(user) {
    return `${user.gender === 'female' ? 'Ms.' : 'Mr.'} ${user.lastName}'s Class`
  }

  loadClass = async () => {
    const classId = localStorage.getItem('classId');
    const result = await Class.students(classId);

    if (_.has(result.data, 'students')) {
      const students = result.data.students.map((s) => {
        const name = s.firstName + ' ' + s.lastName.charAt(0);
        const mastery = sum(s.words, 'experience')/10;
        const wordsLearned = s.words.length;
        const wordsMastered = s.words.filter((w) => w.experience >= 7).length;
        const timePlayed = Math.ceil(sum(s.words, 'timeSpent')/60);
        return {
          id: s._id,
          name: name,
          mastery: Math.ceil(mastery),
          wordsLearned: wordsLearned,
          wordsMastered: wordsMastered,
          timePlayed: timePlayed
        }
      })
      this.setState({ students });
    }
  }

  sortStudents(attr) {
    let students = _.sortBy(this.state.students, attr);
    if (attr !== 'name') { students = students.reverse() };
    this.setState({ students })
  }

  average(attr) {
    return parseInt(sum(this.state.students, attr)/this.state.students.length, 10);
  }

  render() {
    if (this.state.redirect && !window.location.href.endsWith(this.state.redirect)) {
      return <Redirect push to={this.state.redirect} />;
    }

    const studentRows = this.state.students.map((s, i) => {
      return <Row dark={i % 2 === 0} key={s.name} onClick={() => this.setState({ redirect: `/profile/${s.id}` })}>
        <TableCell left>{s.name}</TableCell>
        <TableCell border bold>{s.mastery}</TableCell>
        <TableCell>{s.wordsMastered}</TableCell>
        <TableCell>{s.wordsLearned}</TableCell>
        <TableCell>{`${s.timePlayed}m`}</TableCell>
      </Row>
    })

    return (
      <div>
        <Header>{this.state.title}</Header>
        <Table>
          <tbody>
            <Row>
              <TableCell left header onClick={() => this.sortStudents('name')}>Name</TableCell>
              <TableCell header onClick={() => this.sortStudents('mastery')}>Mastery</TableCell>
              <TableCell header onClick={() => this.sortStudents('wordsMastered')}>Words Mastered</TableCell>
              <TableCell header onClick={() => this.sortStudents('wordsLearned')}>Words Learned</TableCell>
              <TableCell header onClick={() => this.sortStudents('timePlayed')}>Time Played</TableCell>
            </Row>
            {!_.isEmpty(this.state.students) &&
              <Row holistic>
                <TableCell holistic left>Class Average</TableCell>
                <TableCell border bold holistic>{this.average('mastery')}</TableCell>
                <TableCell holistic>{this.average('wordsMastered')}</TableCell>
                <TableCell holistic>{this.average('wordsLearned')}</TableCell>
                <TableCell holistic>{`${this.average('timePlayed')}m`}</TableCell>
              </Row>
            }
            {studentRows}
          </tbody>
        </Table>
      </div>
    );
  }
}

const Row = styled.tr`
  height: 75px;
  background-color: ${props => props.holistic
    ? color.blue
    : props.dark ? color.lightestGray : 'white'
  };
  cursor: pointer;
`

const Header = styled.p`
  width: 100%;
  font-size: 2.75em;
  padding-top: 25px;
  text-align: center;
  height: 25px;
`

const Table = styled.table`
  width: 90%;
  margin: auto;
  border-collapse: collapse;
  text-align: center;
`

const TableCell = styled.td`
  border-left: ${props => props.border ? `5px solid ${color.blue}` : ''};
  border-right: ${props => props.border ? `5px solid ${color.blue}` : ''};
  font-weight: ${props => props.bold ? '600' : '300'};
  color: ${props => props.header
    ? color.gray
    : props.holistic ? 'white' : 'black'};
  font-size: ${props => props.header ? '1.25em' : '1.5em'};
  text-align: ${props => props.left ? 'left' : 'center'};
  padding-left: ${props => props.left ? '10px' : '0px'};
`

export default ClassesDashboard;
