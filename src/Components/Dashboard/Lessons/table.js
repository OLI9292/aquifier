import { connect } from 'react-redux'
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import moment from 'moment';
import styled from 'styled-components';
import _ from 'underscore';

import Button from '../../Common/button';
import { color } from '../../../Library/Styles/index';
import { shouldRedirect } from '../../../Library/helpers'
import { deleteAndRemoveLesson, loadLessons, removeEntity } from '../../../Actions/index';

class LessonsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  async componentDidMount() {
    if (this.props.lessons.length) { return; }
    this.props.dispatch(loadLessons());
  }

  deleteLesson = async lesson => {
    if (window.confirm(`Are you sure you want to delete ${lesson.name}?`)) {
      const result = await this.props.dispatch(deleteAndRemoveLesson(lesson._id, this.props.session));
      if (!result.error) { this.props.dispatch(removeEntity({ lessons: lesson._id })); }
    }
  }

  editLesson(id) {
    this.setState({ redirect: `/lessons/${id}`})
  }

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }

    return (
      <div style={{width:'95%',margin:'0 auto',paddingTop:'5px'}}>
        <Header>
          My Lessons
        </Header>
        
        <Button.small
          color={color.red} style={{float:'right',margin:'-65px 25px 0px 0px'}}
          onClick={() => this.editLesson('new')}>
          Create
        </Button.small>

        <table style={{borderCollapse:'separate',borderSpacing:'0 1em',fontSize:'1.25em',width:'100%'}}>
          <tbody>
            <tr>
              <td style={{width:'10%'}}></td>
              <td style={{width:'35%',textAlign:'center'}}>NAME</td>
              <td style={{width:'25%',textAlign:'center'}}>QUESTIONS</td>
              <td style={{width:'30%',textAlign:'center'}}>UPDATED ON</td>
            </tr>
            {
              this.props.lessons.map((l, i) => {
                const backgroundColor = i % 2 === 0 ? color.lightestGray : 'white';
                return <tr style={{height:'80px',width:'100%',backgroundColor:backgroundColor}} key={i}>
                  <td style={{width:'10%'}}>
                    <EditButton color={color.red} onClick={() => this.deleteLesson(l)}>
                      delete
                    </EditButton>
                    <EditButton color={color.blue} onClick={() => this.editLesson(l._id)}>
                      edit
                    </EditButton>
                  </td>
                  <th style={{width:'35%',textAlign:'center'}}>
                    {l.name}
                  </th>
                  <td style={{width:'25%',textAlign:'center'}}>
                    {l.questions.length}
                  </td>
                  <td style={{width:'30%',textAlign:'center'}}>
                    {moment.unix(l.updatedOn).format('MMM Do YY')}
                  </td>
                </tr>
              })
            }
          </tbody>
        </table>      
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

const EditButton = styled.p`
  color: ${props => props.color};
  height: 10px;
  line-height: 10px;
  cursor: pointer;
  margin-left: 15px;
`

const mapStateToProps = (state, ownProps) => ({
  lessons: _.values(state.entities.lessons),
  session: state.entities.session,
  user: _.first(_.values(state.entities.user))
})

export default connect(mapStateToProps)(LessonsTable);
