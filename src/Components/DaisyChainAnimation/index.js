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
      .attr('transform', 'translate(0,50)');

    d3.interval(() => {
      const idx = this.state.idx === this.state.words.length - 1 ? 0 : this.state.idx + 1;
      this.setState({ idx: idx }, this.update);
    }, 5000);

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
        .attr('x', (d, i) => i * 24)
        .attr('class', (d, i) => { return (i >= data.indices[0] && i <= data.indices[1]) ? 'enter' : 'none' })

    text.enter().append('text')
        .attr('dy', '.35em')
        .attr('y', -60)
        .attr('x', (d, i) => i * 24)
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
        <div style={{marginLeft: '20%', width: '70%', height: '100px'}}>
          <SVG />
        </div>
        <ImageContainer>
          <Image src={require(`../../Library/Images/${word.value}.png`)} />
        </ImageContainer>
        <Definition>{word.definition}</Definition>
      </Layout>
    );
  }
}

const Layout = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background: white;
`

const SVG = styled.svg`
  width: 100%;
  height: 100%;
  font-size: 1.4em;
`

const ImageContainer = styled.div`
  height: 200px;
  width: 100%;
`

const Image = styled.img`
  width: auto;
  height: 100%;
  margin: auto;
  display: block;
`

const Definition = styled.p`
  width: 80%;
  margin-left: 10%;
  height: 75px;
  margin-top: 50px;
  text-align: center;
  font-size: 1.25em;
`

export default DaisyChainAnimation;
