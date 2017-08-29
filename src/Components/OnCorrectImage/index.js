import AWSs3 from '../../Networking/AWSs3.js';
import React, { Component } from 'react';
import './index.css';
import _ from 'underscore';

class OnCorrectImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
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
    console.log(nextProps.displayImage);
    if (_.isNull(nextProps.word)) { return };

    const image = _.find(this.state.data, (obj) => {
      let words = obj.Key.split('.')[0].split('-');
      return _.contains(words, 'cephalopod'); // this.nextProps.word.value
    });

    if (image) {
      const params = {
        Bucket: 'wordcraft-images',
        Key: image.Key
      };

      const request = AWSs3.object(params);
    
      request.on('success', (response) => {
        const imageSource = 'data:image/jpeg;base64,' + this.encode(response.data.Body);
        this.setState({ source: imageSource });
      });
    } else {
      this.setState({ source: null });
    }
  }

  encode(data) {
    const str = data.reduce(function(a,b){ return a+String.fromCharCode(b) },'');
    return btoa(str).replace(/.{76}(?=.)/g,'$&\n');
  }

  render() {
    return (
      <div className={this.props.display ? 'on-correct-image' : 'hide'}>
        <img src={this.state.source} />
      </div>
    );
  }
}

export default OnCorrectImage;
