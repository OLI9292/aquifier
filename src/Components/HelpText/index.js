import React, { Component } from 'react';
import styled from 'styled-components';
import { color } from '../../Library/Styles/index';

class HelpText extends Component {
  render() {
    return (
      <Layout>
        <Text>
        <b>Beginner:</b> Players tap roots to complete the word.
        <br />
        <br />
        <b>Intermediate:</b> Players type the word with one root missing.
        <br />
        <br />
        <b>Advanced:</b> Players type the entire word.
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
