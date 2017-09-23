import React, { Component } from 'react';
import styled from 'styled-components';
import { color } from '../../Library/Styles/index';

class HelpText extends Component {
  render() {
    return (
      <Layout>
        <Text>
        On <b>Beginner</b>, players must tap buttons with roots on them to complete the word.
        <br />
        <br />
        On <b>Intermediate</b>, players must type the word with one root missing.
        <br />
        <br />
        On <b>Advanced</b>, players must type the entire word.
        </Text>
      </Layout>
    );
  }
}

const Layout = styled.div`
  background-color: white;
  position: absolute;
  padding: 15px;
  border: 5px ${color.lightestGray} solid;
  border-radius: 15px;
`

const Text = styled.p`
  display: inline;
  font-size: 1.25em;
  margin-right: 10px;
`


export default HelpText;
