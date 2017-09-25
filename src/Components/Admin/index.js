import Firebase from '../../Networking/Firebase';
import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';

import Buttons from '../Buttons/default';
import Timer from '../Timer/index';
import { color } from '../../Library/Styles/index';

class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accessCode: null,
      players: []
    }

    this.startMatch = this.startMatch.bind(this);
  }

  async componentDidMount() {
    let words = await Firebase.fetchWords();
    words = _.shuffle(_.pluck(words.filter((w) => this.matchesCategory(w.categories, this.props.topics)), 'value')).join(',');

    this.createMatch(words);
  }

  createMatch = async (words) => {
    Firebase.refs.games.once('value', (snapshot) => {
      const accessCodes = _.keys(snapshot.val());
      const accessCode = this.generateAccessCode(accessCodes);

      const game = {};

      game[accessCode] = { 
        level: this.props.level,
        time: this.props.time,
        status: 0,
        words: words
      };

      Firebase.refs.games.update(game, (e) => {
        if (e) {
          console.log(e);
        } else {
          this.setState({ accessCode: accessCode }, this.waitForPlayers.bind(this, accessCode));
        }
      });
    });
  }

  waitForPlayers = async (accessCode) => {
    const ref = Firebase.refs.games.child(accessCode).child('players');
    ref.on('value', (snapshot) => this.setState({ players: _.keys(snapshot.val()) }));
  }

  matchesCategory(a, b) {
    return _.intersection(a.map((x) => x.toLowerCase()), b.map((y) => y.toLowerCase())).length > 0
  }

  generateAccessCode(exclude) {
    return _.sample(_.range(1000, 10000).filter((n) => !_.contains(exclude, n)));
  }

  startMatch() {
    const time = (new Date()).getTime();
    const startMatchUpdate = { status: 1, startTime: time };

    Firebase.refs.games.child(this.state.accessCode).update(startMatchUpdate, (e) => {
      if (e) {
        // TODO: - handle / show error
        console.log(e);
      } else {
        this.timer.track();
      }
    });
  }

  kick(player) {
    Firebase.refs.games.child(this.state.accessCode).child('players').child(player).remove();
  }

  render() {

    const playersTable = () => {
      return this.state.players.length === 0
        ? <Text color={color.gray}>Waiting for players to join...</Text>
        : <table>
          {this.state.players.map((p) => {
           return <tr style={{lineHeight: '0px'}}>
            <td><SmallText style={{width: '125px'}}>{p}</SmallText></td>
            <td onClick={() => this.kick(p)}><KickButton>Kick</KickButton></td>
           </tr> 
          })}
        </table>
    }

    const content = () => {
      return <Table>
        <tr style={{height: '75px'}}>
          <ShortCell alignTop><Text>Access Code</Text></ShortCell>
          <LongCell alignTop><Text color={color.red}>{this.state.accessCode}</Text></LongCell>
        </tr>
        <tr style={{height: '300px', marginBottom: '1em'}}>
          <ShortCell alignTop><Text>Players</Text></ShortCell>
          <LongCell alignTop>{playersTable()}</LongCell>
        </tr>
        <tr>
          <ShortCell><StartButton onClick={this.startMatch}>Start Match</StartButton></ShortCell>
          <LongCell><Timer ref={instance => { this.timer = instance }} /></LongCell>
        </tr>
      </Table>
    }

    return (
      <div>
        {this.state.accessCode && content()}
      </div>
    );
  }
}

const Table = styled.table`
  margin-left: 20px;
  padding-top: 5%;
`

const Text = styled.h4`
  display: inline;
  font-size: 2em;
  margin-right: 10px;
  color: ${props => props.color ? props.color : 'black'};
`

const SmallText = styled.p`
  font-size: 1.5em;
`

const ShortCell = styled.td`
  width: 275px;
  vertical-align: ${props => props.alignTop ? 'top' : 'middle'};
`

const LongCell = styled.td`
  vertical-align: ${props => props.alignTop ? 'top' : 'middle'};
`

const AccessCode = styled.h1`
  color: ${color.red};
  font-size: 10em;
  line-height: 30%;
`

const Container = styled.div`
`

const TimerContainer = styled.div`
  margin: -30px 0px 10px 0px;
`

const StartButton = Buttons.medium.extend`
  background-color: ${color.blue};
  &:hover {
    background-color: ${color.blue10l};
  }
  font-size: 2.5em;
`

const KickButton = Buttons.small.extend`
  background-color: ${color.red};
  &:hover {
    background-color: ${color.red10l};
  }
`

export default Admin;
