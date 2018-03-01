import Firebase from '../../Networking/Firebase';
import _ from 'underscore';
import moment from 'moment';
import queryString from 'query-string';
import { connect } from 'react-redux'
import { Redirect } from 'react-router';
import React, { Component } from 'react';
import get from 'lodash/get';

import { color } from '../../Library/Styles/index';
import { shouldRedirect } from '../../Library/helpers';
import { Container } from '../Common/container';

import {
  Cover,
  ErrorMessage,
  Header,
  KickButton, 
  Text,
  PlayersContainer,
  PlayerContainer,
  Player,
  StartGameButton,
  TimerContainer,
  Triangle
} from './components';

class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      players: []
    };
  }

  componentDidMount() {
    const settings = queryString.parse(window.location.search);
    settings.time = parseInt(settings.time, 10);
    settings.name = settings.name.replace('-', ' ').toUpperCase();
    const timeLeft = `${settings.time}:00`;
    this.setState({ settings: settings, timeLeft: timeLeft }, this.hostGame);
  }

  hostGame() {
    Firebase.refs.games.once('value', snap => {
      const accessCode = this.generateAccessCode(_.keys(snap.val()));      
      const game = {};
      game[accessCode] = _.extend({}, this.state.settings, { status: 0 });

      Firebase.refs.games.update(game, error => {
        // TODO: - handle this error
        error
          ? this.setState({ error: 'Failed to create match.' })
          : this.setState({ accessCode }, this.waitForPlayers.bind(this, accessCode));
      });
    });
  }

  waitForPlayers = async accessCode => {
    const ref = Firebase.refs.games.child(accessCode).child('players');
    ref.on('value', snap => this.setState({ players: _.keys(snap.val()) }));
  }

  startGame() {
    const { players, accessCode } = this.state;
    if (!accessCode) { return; }

    // TODO - uncomment
    /*if (_.isEmpty(players)) {
      this.setState({ error: 'Games require at least 1 player.' });
      return;
    }*/
    
    const end = moment().add(this.state.settings.time, 'minutes');
    const update = { status: 1, end: end.unix() };

    Firebase.refs.games.child(accessCode).update(update, error => {
      if (error) {
        this.setState({ error: 'Failed to start match.' });
      } else {
        this.setState(
          { error: null, end: end },
          () => this.interval = setInterval(() => this.trackTime(), 100)
        );
      }
    });
  } 

  trackTime()  {
    const { minutes, seconds } = moment.duration(this.state.end.diff(moment()))._data;

    if (minutes <= 0 && seconds <= 0) {
      clearInterval(this.interval);
      this.gameOver();
    } else {
      const timeLeft = minutes + ':' + (seconds < 10 ? `0${seconds}` : seconds);
      this.setState({ timeLeft });
    }
  }

  gameOver() {
    Firebase.refs.games.child(this.state.accessCode).update({ status: 2 });
    const redirect = '/leaderboard/' + this.state.accessCode;
    this.setState({ redirect });
  }

  generateAccessCode(exclude) {
    return _.sample(_.range(1000, 10000).filter(n => !_.contains(exclude, n)));
  }  

  kick(player) {
    Firebase.refs.games.child(this.state.accessCode).child('players').child(player).remove();
  }

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }

    const {
      settings,
      timeLeft,
      accessCode,
      players,
      error,
      end
    } = this.state;

    return (
      <Container>
        <Header>
          <Triangle left />
          <Cover />
          <Triangle />
          {get(settings, 'name')}
        </Header>
        
        <Text color={color.gray} size={'0.8em'}>
          access code
        </Text>

        <Text accessCode color={color.mainBlue} size={'4em'}>
          {accessCode}
        </Text>

        <TimerContainer>
          <img
            alt={'clock'}
            src={require('../../Library/Images/clock-black.png')}
            style={{height:'20px',width:'20px'}} />
          <p style={{margin:'10px'}}>
            {timeLeft}
          </p>
        </TimerContainer>

        <StartGameButton inProgress={end} onClick={() => this.startGame()}>
          {end ? 'in progress' : 'start match'}
        </StartGameButton>

        <Text size={'1.1em'}>
          players
        </Text>

        <PlayersContainer>
          {_.map(players.sort(), player => {
            return <PlayerContainer key={player }>
              <Player>
                {player}
              </Player>
              <KickButton onClick={() => this.kick(player)}>
                Kick
              </KickButton>
            </PlayerContainer>
          })}
        </PlayersContainer>

        {error && <ErrorMessage>
          {error}
        </ErrorMessage>}        
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  session: state.entities.session,
  user: _.first(_.values(state.entities.user)),
  levels: _.values(state.entities.levels),
  roots: _.values(state.entities.roots)
});

export default connect(mapStateToProps)(Admin);
