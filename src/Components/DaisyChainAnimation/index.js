import React, { Component } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';

import { color } from '../../Library/Styles/index';

class DaisyChainAnimation extends Component {
  constructor(props) {
    super(props);

    const words = [
      { value: 'cryptography', definition: 'the writing and decoding of secret codes' },
      { value: 'cryptogram', definition: 'a piece of writing in a secret code' },
      { value: 'monogram', definition: 'a symbol with one initial letter from each word' },
      { value: 'monolith', definition: 'a single piece of stone' },
      { value: 'lithophyte', definition: 'a plant that grows upon stone, or a plant that is stony in substance, such as coral' }
    ]

    this.state = {
      words: words,
      idx: 0
    }
  }

  componentDidMount() {
    d3.select('svg')
      .append('g')
      .attr('transform', 'translate(0,100)');

    d3.interval(() => {
      this.update(this.state.words[this.state.idx].value.toUpperCase().split(''));
    }, 3000);

    this.update(this.state.words[this.state.idx].value.toUpperCase().split(''));
  }

  update(data) {
    this.setState({ idx: this.state.idx === this.state.words.length - 1 ? 0 : this.state.idx + 1 });

    const t = d3.transition()
      .duration(750);

    const text = d3
      .select('svg')
      .select('g')
      .selectAll('text')
      .data(data, (d) => d);

    text.exit()
        .attr('class', 'exit')
      .transition(t)
        .attr('y', 60)
        .style('fill-opacity', 1e-6)
        .remove();

    text.attr('class', 'update')
        .attr('y', 0)
        .style('fill-opacity', 1)
      .transition(t)
        .attr('x', (d, i) => i * 18);

    text.enter().append('text')
        .attr('class', 'enter')
        .attr('dy', '.35em')
        .attr('y', -60)
        .attr('x', (d, i) => i * 18)
        .style('fill-opacity', 1e-6)
        .text((d) => d)
      .transition(t)
        .attr('y', 0)
        .style('fill-opacity', 1);
  }

  render() {
    const word = this.state.words[this.state.idx];
    return (
      <Layout>
        <ImageContainer>
          <Image src={require(`../../Library/Images/${word.value}.png`)} />
        </ImageContainer>
        <WordContainer>
          <SVG />
          <Definition>{word.definition}</Definition>
        </WordContainer>
      </Layout>
    );
  }
}

const Layout = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 25px;
  background: ${color.lightGray};
`
const WordContainer = styled.div`
  height: 50%;
  display: inline-block;
  width: 55%;
  margin-left: 10%;
`
const SVG = styled.svg`
  width: 100%;
  height: 100%;
  font-size: 1.25em;
  display: inline-block;
`

const ImageContainer = styled.div`
  display: inline-block;
  vertical-align: top;
  height: 100%;
  width: 30%;
  margin-left: 5%;
  line-height: 100%;
`

const Image = styled.img`
  width: 100%;
  height: auto;
  margin-top: 50px;
  vertical-align: middle;
`

const Definition = styled.p`
  width: 100%;
  color: black;
  font-size: 1.15em;
`

export default DaisyChainAnimation;
