import { connect } from 'react-redux'
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';

import { color } from '../../Library/Styles/index';
import { shouldRedirect, sum } from '../../Library/helpers';

import { loadStudents } from '../../Actions/index';

class ClassesDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      students: []
    }
  }

  componentDidMount() {
    if (this.props.students.length) {
      this.setState({ students: this.props.students.map(this.readStudent) });
    } else if (this.props.user) {
      this.setState({ loading: true }, this.loadClass);
    }
  }  

  componentWillReceiveProps(nextProps) {
    if (_.isEmpty(this.state.students) && nextProps.students.length) {
      this.setState({ students: nextProps.students.map(this.readStudent) });
    } else if (this.props.user && !this.state.loading) {
      this.loadClass();
    }
  }

  loadClass() {
    const _class = _.find(this.props.user.classes, (c) => c.role === 'teacher');
    if (_class) { this.props.dispatch(loadStudents(_class.id)) };
  }

  average(attr) {
    return parseInt(sum(this.state.students, attr)/this.state.students.length, 10);
  }  

  readStudent(data) {
    const name = data.firstName + ' ' + data.lastName.charAt(0);
    const mastery = sum(data.words, 'experience')/10;
    const wordsLearned = data.words.length;
    const wordsMastered = data.words.filter((w) => w.experience >= 7).length;
    const timePlayed = Math.ceil(sum(data.words, 'timeSpent')/60);
    return {
      id: data._id,
      name: name,
      mastery: Math.ceil(mastery),
      wordsLearned: wordsLearned,
      wordsMastered: wordsMastered,
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
      <div style={{width:'100%',textAlign:'center'}}>
        <Header>
          My Class
        </Header>
        {
          !_.isEmpty(this.state.students) &&
          <Table>
            <tbody>
              <Row>
                <TableCell left header onClick={() => this.sortStudents('name')}>Name</TableCell>
                <TableCell header onClick={() => this.sortStudents('mastery')}>Mastery</TableCell>
                <TableCell header onClick={() => this.sortStudents('wordsMastered')}>Words Mastered</TableCell>
                <TableCell header onClick={() => this.sortStudents('wordsLearned')}>Words Learned</TableCell>
                <TableCell header onClick={() => this.sortStudents('timePlayed')}>Time Played</TableCell>
              </Row>
            
              <Row holistic>
                <TableCell holistic left>Class Average</TableCell>
                <TableCell border bold holistic>{this.average('mastery')}</TableCell>
                <TableCell holistic>{this.average('wordsMastered')}</TableCell>
                <TableCell holistic>{this.average('wordsLearned')}</TableCell>
                <TableCell holistic>{`${this.average('timePlayed')}m`}</TableCell>
              </Row>
              
              {this.state.students.map((s, i) => {
                return <Row dark={i % 2 === 0} key={i} onClick={() => this.setState({ redirect: `/profile/${s.id}` })}>
                  <TableCell left>{s.name}</TableCell>
                  <TableCell border bold>{s.mastery}</TableCell>
                  <TableCell>{s.wordsMastered}</TableCell>
                  <TableCell>{s.wordsLearned}</TableCell>
                  <TableCell>{`${s.timePlayed}m`}</TableCell>
                </Row>
              })}
            </tbody>
          </Table>
        }
      </div>
    );
  }
}

const Header = styled.p`
  font-size: 2.25em;
  height: 0px;
  line-height: 0px;
`

const Row = styled.tr`
  height: 75px;
  background-color: ${props => props.holistic
    ? color.blue
    : props.dark ? color.lightestGray : 'white'
  };
  cursor: pointer;
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

const mapStateToProps = (state, ownProps) => ({
  session: state.entities.session,
  students: _.values(state.entities.students),
  user: _.first(_.values(state.entities.user))
})

export default connect(mapStateToProps)(ClassesDashboard)
