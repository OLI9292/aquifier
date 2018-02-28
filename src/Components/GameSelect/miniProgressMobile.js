import _ from 'underscore';
import styled from 'styled-components';
import React, { Component } from 'react';

import { color } from '../../Library/Styles/index';

//import {
//} from './components'

const STATS = [
  {
    name: 'POINTS',
    slug: 'points',
    image: require('../../Library/Images/icon-star.png'),
    color: color.yellow
  },
  {
    name: 'WORDS',
    slug: 'wordsLearned',
    image: require('../../Library/Images/icon-book.png'),
    color: color.yellow
  }
]

class MiniProgressMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const user = this.props.user;
    this.formatData(user);
  }

  formatData(user) {
    const words = user.words;
    const stats = {
      points: this.points(words),
      wordsLearned: this.wordsLearned(words),
    };
    this.setState({ stats });
  }

  points(words) {
    return _.reduce(words, (acc, w) => acc + w.experience, 0);
  }

  wordsLearned(words) {
    return words.length;
  }  

  render() {
    const stats = this.state.stats;

    return (
      <Container>
        {stats && _.map(STATS,  data => {
          return <StatContainer key={data.slug}>
            <Img
              src={data.image} />
            <Stat color={data.color}>
              {stats[data.slug]}
            </Stat>
          </StatContainer>
        })}
      </Container>
    );
  }
}

const Container = styled.div`
  display: flex;
  height: 55px;
  width: 80%;
  margin: 0 auto;
  padding: 15px 0px;
  justify-content: center;
`

const StatContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 0px 30px;
`

const Img = styled.img`
  height: 35px;
  width: 35px;
  margin-right: 5px;
`

const Stat = styled.p`
  font-family: EBGaramondSemiBold;
  font-size: 1.7em;
  color: ${props => props.color};
`

export default MiniProgressMobile;
