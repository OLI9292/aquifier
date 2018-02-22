import _ from 'underscore';
import React, { Component } from 'react';

import { color } from '../../Library/Styles/index';

import {
  Icon,
  Header,
  ProgressListItem,
  Stat,
  StatName,
  SidebarContainer
} from './components'

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
    color: color.green
  },
  {
    name: 'ACCURACY',
    slug: 'accuracy',
    image: require('../../Library/Images/icon-archer-purple.png'),
    color: color.purple
  }
]

class MiniProgress extends Component {
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
      accuracy: this.accuracy(words)
    };
    this.setState({ stats });
  }

  points(words) {
    return _.reduce(words, (acc, w) => acc + w.experience, 0);
  }

  wordsLearned(words) {
    return words.length;
  }  

  accuracy(words) {
    const seen = _.reduce(words, (acc, w) => acc + w.seen, 0);
    const correct = _.reduce(words, (acc, w) => acc + w.correct, 0);
    return Math.round((seen / Math.max(correct, 1)) * 100);
  }    

  render() {
    const stats = this.state.stats;

    return (
      <SidebarContainer>
        <Header>
          Progress
        </Header>
        <ul style={{listStyle:'none',margin:'0 auto',width:'60%',padding:'0'}}>
          {stats && _.map(STATS,  data => {
            return <ProgressListItem key={data.slug}>
              <Icon src={data.image} />
              <StatName>
                {data.name}
              </StatName>
              <Stat color={data.color} forLeaderboards={false}>
                {stats[data.slug]}
              </Stat>
            </ProgressListItem>
          })}
        </ul>
      </SidebarContainer>
    );
  }
}

export default MiniProgress;
