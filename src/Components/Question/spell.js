import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';

import Buttons from '../Buttons/default';
import TextAreas from '../TextAreas/index';
import { color } from '../../Library/Styles/index';

class Spell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      correct: true,
      guess: ''
    }
  }

  componentDidMount() {
    this.reset(this.props.word); 
  }

  componentWillReceiveProps(nextProps) {
    this.reset(nextProps.word);
  }

  checkComplete() {
    
  }

  handleInput(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.checkComplete();
    } else {
      this.setState({ guess: e.target.value });
    }
  }

  reset(word) {

  }

  render() {
    const definition = () => {
      return this.props.word.definition.map((p, idx) => {
        return <span key={idx} style={{color: p.isRoot ? '#F5A50E' : 'black'}}>{p.value}</span>
      })
    }



    return (
      <Layout>
        <Definition>{definition()}</Definition>
        <TextAreas.medium onKeyPress={this.handleInput.bind(this)} />
      </Layout>
    );
  }
}

const Layout = styled.div`
`

const Definition = styled.div`
  font-size: 2.5em;
  margin: auto;
  margin-bottom: 2em;
  width: 75%
`

export default Spell;
