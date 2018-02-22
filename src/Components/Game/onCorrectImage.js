import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';

import AWSs3 from '../../Networking/AWSs3.js';

class OnCorrectImage extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
    const request = AWSs3.imageObjects();
    request.on('success', (response) => {
      this.setState({ data: response.data.Contents });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.word || _.isEqual(nextProps.word, this.state.word)) { return };
    this.setState({ source: null });

    const image = _.find(this.state.data, (obj) => {
      let words = obj.Key.split('.')[0].split('-');
      return _.contains(words, nextProps.word);
    });

    if (image) {
      const params = {
        Bucket: 'wordcraft-images',
        Key: image.Key
      };

      const request = AWSs3.object(params);

      request.on('success', (response) => {
        const imageSource = 'data:image/jpeg;base64,' + this.encode(response.data.Body);
        this.setState({ source: imageSource, word: nextProps.word });
      });
    }
  }

  encode(data) {
    const str = data.reduce(function(a,b){ return a+String.fromCharCode(b) },'');
    return btoa(str).replace(/.{76}(?=.)/g,'$&\n');
  }

  render() {
    return (
      <Container>
        {this.state.source && <Image src={this.state.source} /> }
      </Container>
    );
  }
}

const Container = styled.div`
  text-align: center;
  height: 100%;
  width: 100%;
`

const Image = styled.img`
  height: 100%;
  width: auto;
`

export default OnCorrectImage;
