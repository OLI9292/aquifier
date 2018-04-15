import React, { Component } from 'react';
import styled from 'styled-components';
import marked from "marked";

class Text extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentWillMount() {
    const readmePath = window.location.pathname === "/terms"
      ? require("./terms.md")
      : require("./privacy.md");

    fetch(readmePath)
      .then(response => response.text())
      .then(text => this.setState({ markdown: marked(text)}));
  }

  render() {
    return (
      <Container>
        <section>
          <article dangerouslySetInnerHTML={{__html: this.state.markdown }}></article>
        </section>
      </Container>
    );
  }
}

const Container = styled.div`
  width: 100%;
  background-color: white;
  border-radius: 20px;
  min-height: 70vh;
  padding: 20px 40px;
  box-sizing: border-box;
`

export default Text;
