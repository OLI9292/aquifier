import React, { Component } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';

import { color } from '../../Library/Styles/index';

class DaisyChainAnimation extends Component {
  constructor(props) {
    super(props);

    const words = [
      { value: 'cryptography', definition: 'the writing and decoding of secret codes', indices: [0,4] },
      { value: 'cryptogram', definition: 'a piece of writing in a secret code', indices: [0,4] },
      { value: 'monogram', definition: 'a symbol with one initial letter from each word', indices: [4,7] },
      { value: 'lithophyte', definition: 'a plant that grows upon stone, or a plant that is stony in substance, such as coral', indices: [0,4] }
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
      const idx = this.state.idx === this.state.words.length - 1 ? 0 : this.state.idx + 1;
      this.setState({ idx: idx }, this.update);
    }, 3000);

    this.update();
  }

  update() {
    const data = this.state.words[this.state.idx];
    const word = data.value.toUpperCase().split('');

    const t = d3.transition()
      .duration(750);

    const text = d3
      .select('svg')
      .select('g')
      .selectAll('text')
      .data(word, (d) => d);

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
        .attr('x', (d, i) => i * 18)
        .attr('class', (d, i) => { return (i >= data.indices[0] && i <= data.indices[1]) ? 'enter' : 'none' })

    text.enter().append('text')
        .attr('dy', '.35em')
        .attr('y', -60)
        .attr('x', (d, i) => i * 18)
        .attr('class', (d, i) => { return (i >= data.indices[0] && i <= data.indices[1]) ? 'enter' : 'none' })
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
  width: auto;
  height: 50%;
  margin-top: 50%;
`

const Definition = styled.p`
  width: 100%;
  color: black;
  font-size: 1.15em;
`

export default DaisyChainAnimation;
