import { connect } from 'react-redux'
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';
import moment from 'moment';

import Button from '../../Common/button';
import { color } from '../../../Library/Styles/index';

import { shouldRedirect } from '../../../Library/helpers'
import { loadWordLists, removeEntity, deleteAndRemoveWordList } from '../../../Actions/index';

class WordListsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (this.props.wordLists.length) { return; }
    this.props.dispatch(loadWordLists());
  }

  editWordList(id) {
    this.setState({ redirect: `/word-lists/${id}`})
  }  

  handleDeleteWordList = async wordList => {
    if (window.confirm(`Are you sure you want to delete ${wordList.name}?`)) {
      const result = await this.props.dispatch(deleteAndRemoveWordList(wordList._id, this.props.session));
      if (!result.error) { this.props.dispatch(removeEntity({ wordLists: wordList._id })); }      
    }
  }

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }

    const tableHeaders = (() => {
      return <tr>
        <td style={{width:'10%'}}></td>
        <td style={{width:'35%',textAlign:'center'}}>NAME</td>
        <td style={{width:'25%',textAlign:'center'}}>QUESTIONS</td>
        <td style={{width:'30%',textAlign:'center'}}>UPDATED ON</td>
      </tr>
    })();

    const tableRows = (() => {
      return this.props.wordLists.map((l, i) => {
        const backgroundColor = i % 2 === 0 ? color.lightestGray : 'white';
        return <tr style={{height:'80px',width:'100%',backgroundColor:backgroundColor}} key={i}>
          <td style={{width:'10%'}}>
            <LessonButton color={color.red} onClick={() => this.handleDeleteWordList(l)}>
              delete
            </LessonButton>
            <LessonButton color={color.blue} onClick={() => this.editWordList(l._id)}>
              edit
            </LessonButton>
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
    })();

    return (
      <div style={{width:'95%',margin:'0 auto',paddingTop:'25px'}}>
        <div>
          <p style={{fontSize:'2.75em',textAlign:'center',lineHeight:'0px'}}>
            Word Lists
          </p>
          <Button.small
            color={color.red} style={{float:'right',marginTop:'-65px'}}
            onClick={() => this.editWordList('new')}>
            Create
          </Button.small>
          <table style={{borderCollapse:'separate',borderSpacing:'0 1em',fontSize:'1.25em',width:'100%'}}>
            <tbody>
              {tableHeaders}
              {tableRows}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const LessonButton = styled.p`
  color: ${props => props.color};
  height: 10px;
  line-height: 10px;
  cursor: pointer;
  margin-left: 15px;
`

const mapStateToProps = (state, ownProps) => ({
  session: state.entities.session,
  wordLists: _.values(state.entities.wordLists),
  user: _.first(_.values(state.entities.user))
});

export default connect(mapStateToProps)(WordListsTable);
