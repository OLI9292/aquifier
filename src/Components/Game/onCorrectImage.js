import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';

import { color } from '../../Library/Styles/index';
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
    return (
      <Layout display={this.props.display}>
        {
          this.state.source
            ? <Image src={this.state.source} />
            : <p style={{fontSize:'3.5em',textTransform:'uppercase',color:color.yellow}}>{this.props.word.value}</p>
        }
      </Layout>
    );
  }
}

const Layout = styled.div`
  display: ${props => props.display ? 'flex' : 'none'};
  height: 70%;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
`

const Image = styled.img`
  height: 100%;
  width: auto;
`

export default OnCorrectImage;
