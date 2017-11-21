import Firebase from '../../Networking/Firebase';
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';

import Button from '../Common/button';
import Timer from '../Timer/index';
import { color } from '../../Library/Styles/index';

class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accessCode: null,
      errorMessage: null,
      players: [],
      redirect: false,
      startTime: null
    }

    this.startMatch = this.startMatch.bind(this);
  }

  async componentDidMount() {
    const data = {
      status: 0,
      time: this.props.settings.time,
      wordList: this.props.settings.wordList
    }

    this.createMatch(data);
  }

  createMatch = async (data) => {
    Firebase.refs.games.once('value', (snapshot) => {
      const accessCodes = _.keys(snapshot.val());
      const accessCode = this.generateAccessCode(accessCodes);

      const game = {};
      game[accessCode] = data

      Firebase.refs.games.update(game, (error) => {
        if (error) {
          this.setState({ errorMessage: 'Failed to create match.' });
        } else {
          this.setState({ accessCode: accessCode }, this.waitForPlayers.bind(this, accessCode));
        }
      });
    });
  }

  waitForPlayers = async (accessCode) => {
    const ref = Firebase.refs.games.child(accessCode).child('players');
    ref.on('value', (snapshot) => { this.setState({ players: _.keys(snapshot.val()) }) });
  }

  componentWillUnmount() {
    clearInterval(this.state.checkFocusInterval);    
    Firebase.refs.games.child(this.state.accessCode).child('players').off();
  }

  generateAccessCode(exclude) {
    return _.sample(_.range(1000, 10000).filter((n) => !_.contains(exclude, n)));
  }

  startMatch() {
    if (_.isEmpty(this.state.players)) {
      this.setState({ errorMessage: 'Games require at least 1 player.' });
      return;
    }

    const startTime = (new Date()).getTime();
    const startMatchUpdate = { status: 1, startTime: startTime };

    Firebase.refs.games.child(this.state.accessCode).update(startMatchUpdate, (e) => {
      if (e) {
        this.setState({ errorMessage: 'Failed to start match.' });
      } else {
        this.timer.start(startTime);
        this.setState({ errorMessage: null, startTime: startTime });
      }
    });
  }

  gameOver() {
    Firebase.refs.games.child(this.state.accessCode).update({ status: 2 });
    this.setState({ redirect: true });
  }

  kick(player) {
    Firebase.refs.games.child(this.state.accessCode).child('players').child(player).remove();
  }

  render() {
    if (this.state.redirect && !window.location.href.endsWith(this.state.redirect)) {
      return <Redirect push to={`/leaderboard/${this.state.accessCode}`} />;
    }

    const playersTable = () => {
      return this.state.players.length === 0
        ? <Text color={color.gray}>Waiting for players to join...</Text>
        : <table>
            <tbody>
              {this.state.players.map((p,i) => {
               return <tr style={{lineHeight: '0px'}} key={i}>
                <td><SmallText style={{width: '150px'}}>{p}</SmallText></td>
                <td onClick={() => this.kick(p)}><KickButton>Kick</KickButton></td>
               </tr>
              })}
            </tbody>
        </table>
    }

    const content = () => {
      return <Table>
        <tr>
          <ShortCell alignTop><Text>Access Code</Text></ShortCell>
          <LongCell alignTop><AccessCode color={color.red}>{this.state.accessCode}</AccessCode></LongCell>
        </tr>
        <tr>
          <ShortCell/>
          <LongCell alignTop>
            <Timer ref={instance => { this.timer = instance }}
              time={this.props.settings.time} 
              gameOver={this.gameOver.bind(this)} />
            <br/>
            <Button.medium onClick={this.startMatch} style={{backgroundColor:color.blue,marginBottom:'1em'}}>
              Start Match
            </Button.medium>
          </LongCell>
        </tr>
        <tr style={{marginBottom:'1em'}}>
          <ShortCell alignTop><Text>Players</Text></ShortCell>
          <LongCell alignTop>{playersTable()}</LongCell>
        </tr>
      </Table>
    }

    return (
      <div>
        {this.state.errorMessage &&
          <ErrorMessage display={!_.isNull(this.state.errorMessage)}>
            {this.state.errorMessage}
          </ErrorMessage>
        }
        {this.state.accessCode && content()}
      </div>
    );
  }
}

const ErrorMessage = styled.p`
  font-size: 1.25em;
  position: absolute;
  padding-left: 2%;
  bottom: 12%;
  color: ${color.red};
  visibility: ${props => props.display ? 'visible' : 'hidden'}
`

const Table = styled.table`
  margin-left: 20px;
  padding-top: 5%;
  text-align: center;
`

const Text = styled.h4`
  display: inline;
  font-size: 2em;
  margin-right: 10px;
  color: ${props => props.color ? props.color : 'black'};
`

const SmallText = styled.p`
  font-size: 1.2em;
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
  line-height: 0;
`

const KickButton = Button.small.extend`
  background-color: ${color.red};
  &:hover {
    background-color: ${color.red10l};
  }
`

export default Admin;
