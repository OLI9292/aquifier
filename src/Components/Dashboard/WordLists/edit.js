import { connect } from 'react-redux'
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';

import Button from '../../Common/button';
import { color } from '../../../Library/Styles/index';
import deletePng from '../../../Library/Images/delete.png';
import upArrow from '../../../Library/Images/arrow_up.png';
import downArrow from '../../../Library/Images/arrow_down.png';
import checkboxChecked from '../../../Library/Images/checkbox-checked.png';
import checkboxUnchecked from '../../../Library/Images/checkbox-unchecked.png';
import Link from '../../Common/link';
import Textarea from '../../Common/textarea';
import { unixTime, move } from '../../../Library/helpers';
import { shouldRedirect } from '../../../Library/helpers'
import { createAndLoadWordList, updateAndLoadWordList } from '../../../Actions/index';

class WordListsEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wordList: {
        name: '',
        category: '',
        description: '',
        isStudy: true,
        questions: []
      },
      isNewWordList: true
    };
  }

  componentDidMount() {
    const wordList = _.find(this.props.wordLists, (l) => l._id === _.last(window.location.href.split('/')));
    if (wordList) { this.setState({ wordList: wordList, wordListId: wordList._id, isNewWordList: false }); }
  }

  handleSaveWordList = async () => {
    let error

    if (!this.state.wordList.name)      { error = 'Please enter a name.' }
    if (!this.state.wordList.questions) { error = 'Lists require at least 1 question.' }

    if (error) {
      this.setState({ error });
    } else {
      const wordList = this.state.wordList;
      wordList.updatedOn = unixTime();
      
      if (this.state.isNewWordList) {
        const result = await this.props.dispatch(createAndLoadWordList(wordList, this.props.session));
        result.error ? this.setState({ error: 'Server error.' }) : this.setState({ redirect: '/word-lists' });
      } else {
        const result = await this.props.dispatch(updateAndLoadWordList(wordList, this.state.wordListId, this.props.session));
        result.error ? this.setState({ error: 'Server error.' }) : this.setState({ redirect: '/word-lists' });
      }
    }
  }

  handleDeleteQuestion(index) {
    const wordList = this.state.wordList;
    wordList.questions.splice(index, 1);
    this.setState({ wordList });
  }

  handleChangeIndex(fromIndex, toIndex) {
    if (toIndex < 0) { return };
    const wordList = this.state.wordList;
    const questions = move(wordList.questions, fromIndex, toIndex);
    wordList.questions = questions
    this.setState({ wordList });
  }

  updateDifficulty(index, difficulty, onBlur = false) {
    const wordList = this.state.wordList;
    if (onBlur && !_.contains([0,1,2], difficulty)) { difficulty = 0 };
    wordList.questions[index].difficulty = difficulty;
    this.setState({ wordList });
  }

  addWord(word, difficulty = 0) {
    const wordList = this.state.wordList;
    const add = { word: word, difficulty: difficulty };
    wordList.questions = _.union(wordList.questions, [add]);
    this.setState({ wordList });
  }

  update(attr, to) {
    const wordList = this.state.wordList;
    wordList[attr] = to;
    this.setState({ wordList });
  }

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }

    const links = (() => {
      return <div style={{height:'50px'}}>
        <Link.large 
          color={color.blue}
          onClick={() => this.setState({ redirect: '/word-lists' })} 
          style={{display:'inline-block',float:'left'}}>
          Back
        </Link.large>
        <Link.large
          color={color.green}
          onClick={() => this.handleSaveWordList()}
          style={{display: 'inline-block',float:'right'}}>
          Save
        </Link.large>
      </div>      
    })();

    const settingsTable = () => {
      return <table style={{textAlign:'left'}}>
        <tbody>
          <EditRow>
            <EditTableHeader>Name</EditTableHeader>
            <td>
              <Textarea.medium
                placeholder={'ex. Keystar 1'}
                value={this.state.wordList.name}
                onChange={(e) => this.update('name', e.target.value)}/>
            </td>
          </EditRow>

          <EditRow>
            <EditTableHeader>Category</EditTableHeader>
            <td>
              <Textarea.medium
                placeholder={'ex. ESL'}
                value={this.state.wordList.category}
                onChange={(e) => this.update('category', e.target.value)}/>
            </td>
          </EditRow>

          <EditRow>
            <EditTableHeader>Description</EditTableHeader>
            <td>
              <Textarea.medium long
                placeholder={'ex. English as a Second Language'}
                value={this.state.wordList.description}
                onChange={(e) => this.update('description', e.target.value)}/>
            </td>
          </EditRow>

          <EditRow>
            <EditTableHeader>Type</EditTableHeader>
            <td>
              <div
                onClick={() => this.update('isStudy', true)}
                style={{height:'20px',marginBottom:'10px',display:'flex',alignItems:'center',cursor:'pointer'}}>
                <img style={{height:'100%'}} 
                  alt={this.state.wordList.isStudy ? 'checked' : 'unchecked'}
                  src={this.state.wordList.isStudy ? checkboxChecked : checkboxUnchecked} />
                <p style={{fontFamily:'BrandonGrotesque',marginLeft:'5px'}}>
                  Study
                </p>
              </div>
              <div
                onClick={() => this.update('isStudy', false)}
                style={{height:'20px',marginBottom:'10px',display:'flex',alignItems:'center',cursor:'pointer'}}>
                <img style={{height:'100%'}}
                  alt={!this.state.wordList.isStudy ? 'checked' : 'unchecked'} 
                  src={!this.state.wordList.isStudy ? checkboxChecked : checkboxUnchecked} />
                <p style={{fontFamily:'BrandonGrotesque',marginLeft:'5px'}}>
                  Explore
                </p>
              </div>              
            </td>
          </EditRow>          
        </tbody>
      </table>
    };

    const questionsTable = () => {
      return <table style={{borderCollapse:'separate',borderSpacing:'0 1em',fontSize:'1.25em',width:'100%'}}>
        <tbody>
          <tr style={{fontSize:'1.5em',width:'100%'}}>
            <td></td>
            <td style={{textAlign:'center'}}>WORD</td>
            <td style={{textAlign:'center'}}>DIFFICULTY</td>
          </tr>
          {
            this.state.wordList.questions.map((m, i) => {
              return <tr style={{width:'100%'}} key={i}>
                <td style={{display:'flex',alignItems:'center',float:'right'}}>
                  <img onClick={() => this.handleDeleteQuestion(i)} src={deletePng} alt='delete' style={{height:'40px'}} />
                  <img onClick={() => this.handleChangeIndex(i, i - 1)} src={upArrow} alt='up-arrow' style={{height:'40px'}} />
                  <img onClick={() => this.handleChangeIndex(i, i + 1)} src={downArrow} alt='down-arrow' style={{height:'40px'}} />
                </td>
                
                <td style={{textAlign:'center'}}>
                  {m.word}
                </td>
                
                <td style={{textAlign:'center'}}>
                  <Textarea.medium style={{verticalAlign:'middle',textAlign:'center'}}
                    onFocus={(e) => this.updateDifficulty(i, '')}
                    onChange={(e) => this.updateDifficulty(i, parseInt(e.target.value, 10) || 0)}
                    value={m.difficulty} 
                    onKeyPress={(e) => { if (e.key === 'enter') { this.updateDifficulty(i, parseInt(e.target.value, 10)) } } }
                    onBlur={(e) => this.updateDifficulty(i, parseInt(e.target.value, 10), true)}
                  />
                </td>
              </tr>
            })
          }
        </tbody>
      </table>
    };

    const wordSearch = () => {
      return <AddMoreContainer display={this.state.displayWordSearch}>
        <h4 style={{textAlign:'center'}}>
          Add Words
        </h4>
        <p style={{color:color.blue,float:'right',cursor:'pointer',margin:'-55px 15px 0px 0px',fontSize:'0.9em'}} 
          onClick={() => this.setState({ displayWordSearch: false })}>
          DONE
        </p>
        <div style={{textAlign:'center'}}>
          <p style={{fontSize:'0.75em',display:'inline-block',verticalAlign:'text-bottom',marginRight:'10px'}}>
            Search
          </p>
          <Textarea.small
            onChange={(e) => this.setState({ search: e.target.value })}
            style={{display:'inline-block'}} />
        </div>
        <div style={{fontSize:'0.75em',width:'90%',margin:'0 auto',marginTop:'25px'}}>
          {
            this.props.words
              .filter((w) => w.includes(this.state.search)) 
              .slice(0,25)
              .sort()
              .map((w,i) => <Searched key={i} onClick={() => this.addWord(w)}>{w}</Searched>)
              .reduce((acc, x) => acc === null ? [x] : [acc, ', ', x], null)
          }
        </div>
      </AddMoreContainer>
    };    

    return (
      <div style={{width:'95%',margin:'0 auto',paddingTop:'25px'}}>
        {links}

        <ErrorMessage>
          {this.state.error}
        </ErrorMessage>

        <div style={{textAlign:'center'}}>
          
          {settingsTable()}

          {questionsTable()}

          {wordSearch()}
  
          <DarkBackground display={this.state.displayWordSearch}
            onClick={() => this.setState({ displayWordSearch: false })} />

          <Button.medium onClick={() => this.setState({ displayWordSearch: true })}>
            ADD
          </Button.medium>
        </div>
      </div>
    );
  }
}

const EditRow = styled.tr`
  vertical-align: top;
  height: 75px;
`

const EditTableHeader = styled.th`
  width: 100px;
  fontSize: 1.5em;
  text-align: left;
`

const ErrorMessage = styled.p`
  color: ${color.red};
  height: 15px;
  line-height: 15px;
  text-align: right;
`

const AddMoreContainer = styled.div`
  display: ${props => props.display ? '' : 'none'};
  position: fixed;
  width: 450px;
  height: 350px;
  background-color: white;
  top: 50%;
  left: 50%;
  margin-top: -175px;
  margin-left: -225px;
  border-radius: 15px;  
  z-index: 10;
`

const DarkBackground = styled.div`
  display: ${props => props.display ? '' : 'none'};
  z-index: 5;
  background-color: rgb(0, 0, 0);
  opacity: 0.7;
  -moz-opacity: 0.7;
  filter: alpha(opacity=70);
  height: 100%;
  width: 100%;
  background-repeat: repeat;
  position: fixed;
  top: 0px;
  left: 0px;
`

const Searched = styled.span`
  color: ${color.blue};
  &:hover {
    color: ${color.blue10l};
  }
  cursor: pointer;
`

const mapStateToProps = (state, ownProps) => ({
  wordLists: _.values(state.entities.wordLists),
  words: _.pluck(_.values(state.entities.words), 'value'),
  session: state.entities.session,
  user: _.first(_.values(state.entities.user))
});

export default connect(mapStateToProps)(WordListsEdit);
