import React, { Component } from 'react';
import styled from 'styled-components';
import { color } from '../../Library/Styles/index';

class HelpText extends Component {
  render() {
    const content = () => {
      if (this.props.type === 'classroomTutorial') {
        return <Text>
          To set up an in-class spelling bee, follow these steps:
          <br />
          <br />
          <b>1</b> Click <b>Play Spelling Bee</b> and <b>Create Game</b>.
          <br />
          <b>2</b> Choose settings for the game and then click <b>Generate Access Code</b>.
          <br />
          <b>3</b> Have all players click <b>Play Spelling Bee</b> and then <b>Join Game</b> with the access code.
          <br />
          <b>4</b> When everyone is ready, click <b>Start</b>.
        </Text>
      } else if (this.props.type === 'difficultyExplanation') {
        return <Text>
          <b>Beginner:</b> Players tap roots to complete the word.
          <br />
          <br />
          <b>Intermediate:</b> Players type the word with one root missing.
          <br />
          <br />
          <b>Advanced:</b> Players type the entire word.
        </Text>        
      }
    }
    return (
      <Layout>
        {content()}
      </Layout>
    );
  }
}

const Layout = styled.div`
  background-color: white;
  padding: 15px;
  border: 5px ${color.lightestGray} solid;
  border-radius: 15px;
`

const Text = styled.p`
  display: inline;
  font-size: 1.25em;
  margin-right: 10px;
  
  @media (max-width: 1100px) {
    font-size: 0.9em;
  }
`


export default HelpText;
