import React, { Component } from 'react';
import { Redirect } from 'react-router';
import moment from 'moment';
import styled from 'styled-components';

import Button from '../../Common/button';
import { color } from '../../../Library/Styles/index';
import Lesson from '../../../Models/Lesson';
import User from '../../../Models/User';

class LessonsTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lessons: []
    }
  }

  async componentDidMount() {
    const userId = User.loggedIn('_id');
    this.setState({ userId }, this.loadlessons);
  }

  loadlessons = async () => {
    if (this.state.userId) {
      const result = await Lesson.forTeacher(this.state.userId);
      const lessons = result.data || [];
      this.setState({ lessons });      
    }
  }

  deleteLesson = async (i) => {
    if (window.confirm(`Are you sure you want to delete ${this.state.lessons[i].name}?`)) {
      await Lesson.delete(this.state.lessons[i]._id);
      this.loadlessons();
    }
  }

  editLesson = (id) => {
    this.setState({ redirect: `/lessons/${id}`})
  }

  render() {
    if (this.state.redirect && !window.location.href.endsWith(this.state.redirect)) {
      return <Redirect push to={this.state.redirect} />;
    }

    return (
      <div style={{width:'95%',margin:'0 auto',paddingTop:'5px'}}>
        <Header>My Lessons</Header>
        <Button.small
          color={color.red} style={{float:'right',margin:'-65px 25px 0px 0px'}}
          onClick={() => this.editLesson('new')}
        >Create</Button.small>
        <Table>
          <tbody>
            <tr>
              <td style={{width:'10%'}}></td>
              <td style={{width:'35%',textAlign:'center'}}>NAME</td>
              <td style={{width:'25%',textAlign:'center'}}>QUESTIONS</td>
              <td style={{width:'30%',textAlign:'center'}}>UPDATED ON</td>
            </tr>
            {
              this.state.lessons.map((l, i) => {
                const backgroundColor = i % 2 === 0 ? color.lightestGray : 'white';
                return <tr style={{height:'80px',width:'100%',backgroundColor:backgroundColor}} key={i}>
                  <td style={{width:'10%'}}>
                    <EditButton color={color.red} onClick={() => this.deleteLesson(i)}>delete</EditButton>
                    <EditButton color={color.blue} onClick={() => this.editLesson(this.state.lessons[i]._id)}>edit</EditButton>
                  </td>
                  <th style={{width:'35%',textAlign:'center'}}>{l.name}</th>
                  <td style={{width:'25%',textAlign:'center'}}>{l.questions.length}</td>
                  <td style={{width:'30%',textAlign:'center'}}>{moment.unix(l.updatedOn).format('MMM Do YY')}</td>
                </tr>
              })
            }
          </tbody>
        </Table>      
      </div>
    );
  }
}

const Header = styled.p`
  width: 100%;
  font-size: 2.75em;
  text-align: center;
  height: 25px;
`

const Table = styled.table`
  width: 100%;
  font-size: 1.25em;
  border-collapse: separate;
  border-spacing: 0 1em;
`

const EditButton = styled.p`
  color: ${props => props.color};
  height: 10px;
  line-height: 10px;
  cursor: pointer;
  margin-left: 15px;
`
export default LessonsTable;
