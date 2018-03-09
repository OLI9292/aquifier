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
      const data = _.map(response.data.Contents, obj => {
        const word = obj.Key.split('.')[0].split('-')[0];
        const key = obj.Key;
        return { word: word, key: key };
      });
      this.props.setImages(data);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.image) { return; }

    const params = {
      Bucket: 'wordcraft-images',
      Key: nextProps.image.key
    };

    const request = AWSs3.object(params);

    request.on('success', (response) => {
      const imageSource = 'data:image/jpeg;base64,' + this.encode(response.data.Body);
      this.setState({ source: imageSource });
    });
  }

  encode(data) {
    const str = data.reduce(function(a,b){ return a+String.fromCharCode(b) },'');
    return btoa(str).replace(/.{76}(?=.)/g,'$&\n');
  }

  render() {
    const show = this.props.show && this.state.source;

    return (
      <Container>
        {show && <Image src={this.state.source} /> }
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
  max-height: 100%;
  max-width: 100%;
  height: auto;
  width: auto;
`

export default OnCorrectImage;
