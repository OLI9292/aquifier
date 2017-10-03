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
          <b>1</b> Teacher clicks play spelling bee and create game.
          <br />
          <b>2</b> Choose settings for game and click generate access code.
          <br />
          <b>3</b> All players navigate to playwordcraft.com on their own computers.
          <br />
          <b>4</b> All players click play spelling bee and then join game with the access code.
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
