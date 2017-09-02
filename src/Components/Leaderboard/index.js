import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';

import Buttons from '../Buttons/default';
import Firebase from '../../Networking/Firebase';
import { color } from '../../Library/Styles/index';

class Leaderboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataLoaded: false,
      scores: []
    }
  }

  componentDidMount() {
    Firebase.refs.games.child(this.props.accessCode).on('value', (snapshot) => {
      this.update(snapshot.val());
    })
  }

  update(snap) {
    if (!_.isEqual(snap.scores, this.state.scores)) {
      console.log(snap.scores);
      this.setState({ level: snap.level, time: snap.time, scores: snap.scores, dataLoaded: true });
    };
  }

  render() {
    const top3 = this.state.scores.slice(0, 3);
    const rest = this.state.scores.slice(3, this.state.scores.length);

    const top3Table = () => {
      
    }

    return (
      <Layout>
        <Header>Game Over!</Header>
        {
          this.state.dataLoaded && 
          <div>
          <Container>
            <GameSetting>{`${this.state.time} Minutes`}</GameSetting>
            <GameSetting>{this.state.level}</GameSetting>
          </Container>
          <ResultsHeader>Results</ResultsHeader>
          </div>
        }
      </Layout>
    );
  }
}

const Layout = styled.div`
  padding-top: 1em;
  margin: auto;
  text-align: center;
  width: 75%;
`

const Header = styled.p`
  font-size: 3em;
  height: 1em;
`

const Container = styled.div`
  display: inline-block;
`

const GameSetting = Buttons.medium.extend`
  background-color: ${color.red};
  float: left;
  margin: 0em 1em 0em 1em;
`

const ResultsHeader = styled.h2`
  font-size: 2em;
`

export default Leaderboard;
