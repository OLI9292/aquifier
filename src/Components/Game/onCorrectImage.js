import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';

import AWSs3 from '../../Networking/AWSs3.js';

class OnCorrectImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      display: false,
      word: '',
      source: null
    }
  }

  componentDidMount() {
    const request = AWSs3.imageObjects();
    request.on('success', (response) => {
      this.setState({ data: response.data.Contents });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (_.isNull(nextProps.word) || (nextProps.word.value === this.state.word)) { return };
    this.setState({ source: null });

    const image = _.find(this.state.data, (obj) => {
      let words = obj.Key.split('.')[0].split('-');
      return _.contains(words, nextProps.word.value);
    });

    if (image) {
      const params = {
        Bucket: 'wordcraft-images',
        Key: image.Key
      };

      const request = AWSs3.object(params);

      request.on('success', (response) => {
        const imageSource = 'data:image/jpeg;base64,' + this.encode(response.data.Body);
        this.setState({ source: imageSource, word: nextProps.word.value });
      });
    }
  }

  encode(data) {
    const str = data.reduce(function(a,b){ return a+String.fromCharCode(b) },'');
    return btoa(str).replace(/.{76}(?=.)/g,'$&\n');
  }

  render() {
    const definition = () => {
      return this.props.word.definition.map((p, idx) => {
        return <span key={idx} style={{color: p.isRoot ? '#F5A50E' : 'black'}}>{p.value}</span>
      })
    }

    return (
      <Layout display={this.props.display}>
        <p style={{fontSize:'1.75em'}}>{definition()}</p>
        <p style={{fontSize:'2.5em', letterSpacing: '0.2em'}}>{this.props.word.value.toUpperCase()}</p>
        {this.state.source && <Image src={this.state.source} /> }
      </Layout>
    );
  }
}

const Layout = styled.div`
  display: ${props => props.display ? '' : 'none'};
  text-align: center;
`

const Image = styled.img`
  height: 200px;
  width: auto;
`

export default OnCorrectImage;
