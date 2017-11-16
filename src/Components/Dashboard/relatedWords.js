import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';

import { color } from '../../Library/Styles/index';
import Textarea from '../Common/textarea';

class RelatedWords extends Component {
  constructor(props) {
    super(props);

    this.state = {
      suggested: this.props.suggested || [],
      displayAddMore: false
    };
    console.log(this.props.words)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.suggested) {
      this.setState({ suggested: nextProps.suggested });
    }
  }

  handleClickedSuggested(word) {
    const added = _.union(this.props.added, [word]);
    this.props.updateRelatedWords(this.props.index, added);
  }

  handleClickedAdded(word) {
    const added = this.props.added.filter((a) => a !== word);
    this.props.updateRelatedWords(this.props.index, added);
  }

  render() {
    const added = this.props.added
      .map((a,i) => <Added key={i} onClick={() => this.handleClickedAdded(a)}>{a}</Added>)
      .reduce((acc, x) => acc === null ? [x] : [acc, ', ', x], null);

    const suggested = this.state.suggested
      .filter((s) => !_.contains(this.props.added, s))
      .slice(0,5)
      .sort()
      .map((s,i) => <Suggested key={i} onClick={() => this.handleClickedSuggested(s)}>{s}</Suggested>)
      .reduce((acc, x) => acc === null ? [x] : [acc, ', ', x], null);

    const searched = this.props.words
      .filter((w) => w.includes(this.state.search))
      .slice(0,10)
      .sort()
      .map((s,i) => <Suggested key={i} onClick={() => this.handleClickedSuggested(s)}>{s}</Suggested>)
      .reduce((acc, x) => acc === null ? [x] : [acc, ', ', x], null)      

    const addMore = () => {
      return <AddMoreContainer display={this.state.displayAddMore}>
        <h4 style={{textAlign:'center'}}>Add Words</h4>
        <p style={{color:color.blue,float:'right',cursor:'pointer',margin:'-70px 10px 0px 0px',fontSize:'0.9em'}} 
          onClick={() => this.setState({ displayAddMore: false })}>DONE</p>
        <p style={{fontSize:'0.75em',width:'90%',margin:'0 auto'}}><b>Added Words:</b> {added}</p>
        <div style={{textAlign:'center'}}>
          <p style={{fontSize:'0.75em',display:'inline-block',verticalAlign:'text-bottom',marginRight:'10px'}}>Search</p>
          <Textarea.small style={{display:'inline-block'}} onChange={(e) => this.setState({ search: e.target.value })}></Textarea.small>
        </div>
        <div style={{fontSize:'0.75em',width:'90%',margin:'0 auto',marginTop:'25px'}}>
          {searched}
        </div>
      </AddMoreContainer>
    }

    return (
      <div>
        <p style={{fontSize:'0.75em'}}><b>Added Words:</b> {added}</p>
        <p style={{fontSize:'0.75em'}}><b>Suggested Words:</b> {suggested}</p>
        <p style={{fontSize:'0.75em',textAlign:'center',cursor:'pointer'}} onClick={() => this.setState({ displayAddMore: true })}><b>Add More</b></p>
        {addMore()}
        <DarkBackground display={this.state.displayAddMore} onClick={() => this.setState({ displayAddMore: false })} />
      </div>
    );
  }
}

const Added = styled.span`
  color: ${color.green};
  &:hover {
    color: ${color.green10l};
  }
  cursor: pointer;
`

const Suggested = styled.span`
  color: ${color.blue};
  &:hover {
    color: ${color.blue10l};
  }
  cursor: pointer;
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

export default RelatedWords;
