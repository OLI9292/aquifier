import { connect } from 'react-redux'
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';

import { color } from '../../Library/Styles/index';
import { shouldRedirect, sum } from '../../Library/helpers';
import { Container } from '../Common/container';
import Header from '../Common/header';

import { fetchStudentsAction } from '../../Actions/index';

class MyClass extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
    if (this.props.students.length) {
      this.setState({ students: this.props.students.map(this.readStudent) });
    } else if (this.props.user) {
      this.setState({ loading: true }, () => this.loadClass(this.props));
    }
  }  

  componentWillReceiveProps(nextProps) {
    if (nextProps.students.length && !this.state.students) {
      const students = nextProps.students.map(this.readStudent);
      this.setState({ students });
    } else if (nextProps.user && !this.state.loading) {
      this.loadClass(nextProps);
    }
  }

  loadClass(props) {
    const _class = _.find(props.user.classes, (c) => c.role === 'teacher');
    if (_class) { this.props.dispatch(fetchStudentsAction(_class.id)) };
  }

  average(attr) {
    return parseInt(sum(this.state.students, attr)/this.state.students.length, 10);
  }  

  readStudent(data) {
    const name = data.firstName + ' ' + data.lastName.charAt(0);
    const wordsLearned = data.words.length;
    const timePlayed = Math.ceil(sum(data.words, 'timeSpent')/60);
    return {
      id: data._id,
      name: name,
      wordsLearned: wordsLearned,
      timePlayed: timePlayed
    }    
  }

  sortStudents(attr) {
    let students = _.sortBy(this.state.students, attr);
    if (attr !== 'name') { students = students.reverse() };
    this.setState({ students })
  }

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }

    return (
      <Container>
        <Header.medium>
          my class
        </Header.medium>
        {
          !_.isEmpty(this.state.students) &&
          <Table>
            <tbody>
              <Row>
                <TableCell left header onClick={() => this.sortStudents('name')}>NAME</TableCell>
                <TableCell header onClick={() => this.sortStudents('wordsLearned')}>WORDS LEARNED</TableCell>
                <TableCell right header onClick={() => this.sortStudents('timePlayed')}>TIME PLAYED</TableCell>
              </Row>
            
              <Row holistic>
                <TableCell holistic left>Class Average</TableCell>
                <TableCell holistic>{this.average('wordsLearned')}</TableCell>
                <TableCell holistic right>{`${this.average('timePlayed')}m`}</TableCell>
              </Row>
              
              {this.state.students.map((s, i) => {
                return <Row dark={i % 2 === 0} key={i} onClick={() => this.setState({ redirect: `/profile/${s.id}` })}>
                  <TableCell left>{s.name}</TableCell>
                  <TableCell>{s.wordsLearned}</TableCell>
                  <TableCell right>{`${s.timePlayed}m`}</TableCell>
                </Row>
              })}
            </tbody>
          </Table>
        }
      </Container>
    );
  }
}

const Row = styled.tr`
  height: 75px;
  background-color: ${props => props.holistic
    ? color.mainBlue
    : props.dark ? color.lightestGray : 'white'
  };
  cursor: pointer;
`

const Table = styled.table`
  width: 100%;
  margin: auto;
  border-collapse: collapse;
  text-align: center;
`

const TableCell = styled.td`
  border-left: ${props => props.border ? `5px solid ${color.mainBlue}` : ''};
  border-right: ${props => props.border ? `5px solid ${color.mainBlue}` : ''};
  color: ${props => props.header
    ? color.gray2
    : props.holistic ? 'white' : 'black'};
  font-family: ${props => props.header ? 'BrandonGrotesqueBold' : 'BrandonGrotesque'};
  font-size: ${props => props.header ? '1em' : '1.5em'};
  text-align: ${props => props.left ? 'left' : 'center'};
  padding-left: ${props => props.left ? '7.5%' : '0'};
  padding-right: ${props => props.right ? '7.5%' : '0'};
`

const mapStateToProps = (state, ownProps) => ({
  session: state.entities.session,
  students: _.values(state.entities.students),
  user: _.first(_.values(state.entities.user))
})

export default connect(mapStateToProps)(MyClass)
