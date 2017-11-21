import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';

import Firebase from '../../Networking/Firebase';
import { color } from '../../Library/Styles/index';

class Leaderboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataLoaded: true,
      players: []
    }
  }

  componentDidMount() {
    Firebase.refs.games.child(this.props.gameId).on('value', (snapshot) => {
      const snap = snapshot.val();

      if (snap.players) {
        const sorted = _.sortBy(_.keys(snap.players).map((p) => ({ 'name': p, 'score' : snap.players[p] })), 'score').reverse();
        const updated = this.withPositions(sorted);

        if (!_.isEqual(updated, this.state.players)) {
          this.setState({ level: snap.level, time: snap.time, players: updated, dataLoaded: true });
        };
      }
    })
  }

  componentWillUnmount() {
    Firebase.refs.games.child(this.props.settings.accessCode).off();
  }

  withPositions(players) {
    let currentPosition = 1;
    players.forEach((s, idx) => {
      const tie = (idx === 0) || (players[idx].score === players[idx - 1].score);
      if (tie === false) {
        currentPosition++;
      }
      players[idx].position = currentPosition;
    });
    return players;
  }

  render() {
    const colors = {
      1: color.gold,
      2: color.silver,
      3: color.bronze
    };

    const rows = () => {
      return this.state.players.map((p) => {
        return <Row>
          <LeftAlignCell style={{ color: colors[p.position] || 'black' }}>{p.position}.</LeftAlignCell>
          <LeftAlignCell>{p.name}</LeftAlignCell>
          <RightAlignCell>{p.score}</RightAlignCell>
        </Row>
      })
    }

    return (
      <Layout>
        <Header>Game Over!</Header>
        {
          this.state.dataLoaded && 
          <Container>
            <ResultsHeader>Results</ResultsHeader>
            <Table>
              <col width="10%" />
              <col width="20%" />
              <col width="70%" />
              {rows()}
            </Table>
          </Container>
        }
      </Layout>
    );
  }
}

const Row = styled.tr`
  width: 100%;
`

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
  margin: auto;
  width: 100%;
`

const ResultsHeader = styled.h2`
  font-size: 2em;
`

const Table = styled.table`
  width: 100%;
`

const LeftAlignCell = styled.td`
  font-size: 1.5em;
  text-align: left;
`

const RightAlignCell = styled.td`
  font-size: 1.5em;
  text-align: right;
`

export default Leaderboard;
