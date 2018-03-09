import React, { Component } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';

import { color } from '../../Library/Styles/index';

const words = [
  { value: 'cryptogram', definition: 'a piece of writing in a secret code', indices: [0,4] },
  { value: 'cryptography', definition: 'the writing and decoding of secret codes', indices: [0,4] },
  { value: 'telegraph', definition: 'a device for sending a written message over a great distance by wires', indices: [4,8] },
  { value: 'dermatoglyph', definition: 'the fingerprint, i.e. a symbol found in the skin of the fingertips', indices: [] },
  { value: 'decagon', definition: 'a geometrical shape with ten angles', indices: [] },
  { value: 'cephalopod', definition: 'an animal, such as a squid, that uses its head as a foot', indices: []},
  { value: 'gastropod', definition: 'an animal that uses its stomach as a foot - such as a snail', indices: [6,8] },
  { value: 'pteropod', definition: 'a sea creature with a winged foot for swimming, also known as the sea butterfly', indices: [5,7] },
  { value: 'pterodactyl', definition: 'an extinct flying dinosaur which had a finger on its wing', indices: [0,4] },
  { value: 'quadruped', definition: 'a four legged animal', indices: [] },
  { value: 'equilateral', definition: 'having equal sides', indices: [4,10] },
  { value: 'polydactylic', definition: 'having many or too many fingers or toes', indices: [] },
  { value: 'polyhedron', definition: 'a solid geometrical shape with many faces', indices: [0,3] },
  { value: 'protoplasm', definition: 'the living material inside a cell, so named because it is the first formed thing', indices: [] },
  { value: 'isometric', definition: 'having equal measure', indices: [] },
  { value: 'lithograph', definition: 'a symbol or inscription on stone', indices: [0,3] },
  { value: 'monolith', definition: 'a single piece of stone', indices: [4,7] },
  { value: 'monogram', definition: 'a symbol with one initial letter from each word', indices: [4,7] }
]

class DaisyChain extends Component {
  constructor(props) {
    super(props);

    this.state = {
      words: words,
      idx: 0
    }
  }

  componentDidMount() {
    d3.select('svg')
      .append('g')
      .attr('transform', 'translate(0,50)');

    this.interval = setInterval(() => {
      const idx = this.state.idx === this.state.words.length - 1 ? 0 : this.state.idx + 1;
      this.setState({ idx: idx }, this.update);
    }, 5000);

    this.update();
  }

  componentWillUnmount() {
    this.interval && clearInterval(this.interval);
    this.interval = false;
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
    const marginLeft = `${Math.max(0, 40 - (word.value.length * 3))}%`;

    return (
      <Container>
        <div style={{marginLeft:marginLeft,height:'75px',margin:'-15px 0px 15px 0px'}}>
          <SVG />
        </div>
        
        <ImageContainer>
          <Image src={require(`../../Library/Images/${word.value}.png`)} />
        </ImageContainer>

        <Definition>
          {word.definition}
        </Definition>
      </Container>
    );
  }
}

const Container = styled.div`
  width: 300px;
  height: 300px;
  border-radius: 10px;
  background: white;
  border: 2px solid ${color.gray};
  padding: 30px;
  margin: 0 auto;
  @media (max-width: 400px) {
    width: 250px;
    height: 250px;
    padding: 20px;
    font-size: 0.8em;
  }  
`

const SVG = styled.svg`
  width: 100%;
  margin-bottom: 10px;
  height: 100%;
  font-size: 2.5em;
  font-family: monospace;
`
const ImageContainer = styled.div`
  height: 150px;
  width: 100%;
  @media (max-width: 400px) {
    height: 125px;
  }  
`

const Image = styled.img`
  max-height: 100%;
  max-width: 100%;
  width: auto;
  height: auto;
  margin: auto;
  display: block;
`

const Definition = styled.p`
  height: 75px;
  text-align: center;
  font-size: 1.2em;
`

export default DaisyChain;
