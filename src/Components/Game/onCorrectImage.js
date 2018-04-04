import { connect } from 'react-redux'
import React, { Component } from 'react';
import styled from 'styled-components';
import get from 'lodash/get';

import {
  fetchImageAction
} from '../../Actions/index';

class OnCorrectImage extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  async componentWillReceiveProps(nextProps) {
    const word = nextProps.word;
    if (word === this.state.word) { return; }
    this.setState({ word });

    const query = "word=" + word;
    const result = await this.props.dispatch(fetchImageAction(query));
    if (result.error || !get(result.response.entities, 'image')) { return; }

    const source = result.response.entities.image.source;
    this.setState({ source });
  }

  render() {
    const {
      source
    } = this.state;

    return (
      <Container>
        {source && <Image src={source} />}
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

export default connect()(OnCorrectImage);
