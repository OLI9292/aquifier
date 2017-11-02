import React, { Component } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';

import { color } from '../../Library/Styles/index';

class DaisyChain extends Component {
  constructor(props) {
    super(props);

    const words = [
      { value: 'cryptogram', definition: 'a piece of writing in a secret code', indices: [0,4], marginAdjustment: '24%' },
      { value: 'cryptography', definition: 'the writing and decoding of secret codes', indices: [0,4], marginAdjustment: '20%' },
      { value: 'telegraph', definition: 'a device for sending a written message over a great distance by wires', indices: [4,8],marginAdjustment: '25%' },
      { value: 'dermatoglyph', definition: 'the fingerprint, i.e. a symbol found in the skin of the fingertips', indices: [], marginAdjustment: '20%' },
      { value: 'decagon', definition: 'a geometrical shape with ten angles', indices: [], marginAdjustment: '32%' },
      { value: 'cephalopod', definition: 'an animal, such as a squid, that uses its head as a foot', indices: [], marginAdjustment: '25%'},
      { value: 'gastropod', definition: 'an animal that uses its stomach as a foot - such as a snail', indices: [6,8], marginAdjustment: '25%' },
      { value: 'pteropod', definition: 'a sea creature with a winged foot for swimming, also known as the sea butterfly', indices: [5,7], marginAdjustment: '28%' },
      { value: 'pterodactyl', definition: 'an extinct flying dinosaur which had a finger on its wing', indices: [0,4], marginAdjustment: '23%' },
      { value: 'quadruped', definition: 'a four legged animal', indices: [], marginAdjustment: '26%' },
      { value: 'quadrilateral', definition: 'a four sided shape', indices: [0,3], marginAdjustment: '17%' },
      { value: 'equilateral', definition: 'having equal sides', indices: [4,10], marginAdjustment: '23%' },
      { value: 'polydactylic', definition: 'having many or too many fingers or toes', indices: [], marginAdjustment: '20%' },
      { value: 'polyhedron', definition: 'a solid geometrical shape with many faces', indices: [0,3], marginAdjustment: '24%' },
      { value: 'protoplasm', definition: 'the living material inside a cell, so named because it is the first formed thing', indices: [], marginAdjustment: '24%' },
      { value: 'isometric', definition: 'having equal measure', indices: [], marginAdjustment: '25%' },
      { value: 'lithograph', definition: 'a symbol or inscription on stone', indices: [0,3], marginAdjustment: '24%' },
      { value: 'monolith', definition: 'a single piece of stone', indices: [4,7], marginAdjustment: '28%' },
      { value: 'monogram', definition: 'a symbol with one initial letter from each word', indices: [4,7], marginAdjustment: '26%' }
]

    this.state = {
      words: words,
      idx: 0,
      interval: null
    }
  }

  componentDidMount() {
    d3.select('svg')
      .append('g')
      .attr('transform', 'translate(0,50)');

    const interval = setInterval(() => {
      const idx = this.state.idx === this.state.words.length - 1 ? 0 : this.state.idx + 1;
      this.setState({ idx: idx }, this.update);
    }, 5000);
    this.setState({ interval });
    this.update();
  }

  componentWillUnmount() {
    clearTimeout(this.state.interval)
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
    const marginValues = []
    return (
      <Layout>
        <div style={{marginLeft: word.marginAdjustment, height: '100px'}}>
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

  @media (max-width: 1100px) {
   max-width: 440px;
   margin: 0px auto;
 }
`

const SVG = styled.svg`
  width: 100%;
  height: 100%;
  font-size: 1.8em;
  font-family: monospace;
  @media (max-width: 450px) {
    font-size: 1.4em;
  }
`
const ImageContainer = styled.div`
  height: 200px;
  width: 100%;
  margin-bottom: 10px;
  @media (max-width: 450px) {
      height: 150px;
  }
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
  @media (max-width: 1100px) {
    display: none;
  }
`

export default DaisyChain;
