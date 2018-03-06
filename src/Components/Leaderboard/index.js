import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';

import Firebase from '../../Networking/Firebase';
import { color } from '../../Library/Styles/index';
import { Container } from '../Common/container';
import Header from '../Common/header';

class Leaderboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      players: []
    }
  }

  componentDidMount() {
    this.setState({ gameId: _.last(window.location.href.split('/')) }, this.setup);
  }

  setup() {
    Firebase.refs.games.child(this.state.gameId).on('value', (snapshot) => {
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
    Firebase.refs.games.child(this.state.gameId).off();
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
      return this.state.players.map((p, i) => {
        return <tr key={i} style={{width:'100%'}}>
          <LeftAlignCell style={{ color: colors[p.position] || 'black' }}>
            {p.position}.
          </LeftAlignCell>
          <LeftAlignCell style={{fontFamily:'BrandonGrotesque'}}>
            {p.name}
          </LeftAlignCell>
          <RightAlignCell>
            {p.score}
          </RightAlignCell>
        </tr>
      })
    }

    return (
      <Container>
        <Header.extraLarge style={{color:'black'}}>
          game over!
        </Header.extraLarge>
        {
          this.state.dataLoaded &&
          <div style={{margin:'0 auto',width:'100%'}}>
            <Header.medium>
              results
            </Header.medium>
            <Table>
              <colgroup>
                <col width='10%' />
                <col width='35%' />
                <col width='35%' />
              </colgroup>
              <tbody>
                {rows()}
              </tbody>
            </Table>
          </div>
        }
      </Container>
    );
  }
}

const Table = styled.table`
  width: 60%;
  margin: 0 auto;
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
