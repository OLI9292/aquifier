import { Redirect } from 'react-router';
import React, { Component } from 'react';
import { connect } from 'react-redux'
import get from "lodash/get";
import styled, { keyframes } from 'styled-components';
import _ from 'underscore';

import io from 'socket.io-client';

import Bot from '../../../Models/Bot';
import CONFIG from '../../../Config/main';
import Button from '../../Common/button';
import { shouldRedirect } from '../../../Library/helpers';
import { color, media } from '../../../Library/Styles/index';

import {
  findGameAction,
  fetchUserAction,
  removeEntityAction,
  updateEntityAction
} from '../../../Actions/index';

const BUTTON_DATA = {
  none: {
    color: color.blue,
    text: "find opponent"
  },
  matchmaking: {
    color: color.warmYellow,
    text: "searching"
  },
  matched: {
    color: color.red,
    text: "opponent found"
  }
};

const COUNTDOWN_DELAY = 3;

class Battle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "none"
    };
  }

  componentDidMount() {
    this.props.dispatch(removeEntityAction('game'));

    if (window.location.search.includes("searchImmediately=true")) {
      this.findGame();
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      user,
      game
    } = this.props;

    if (_.isEqual(game, nextProps.game) || !nextProps.game || !user) { return; }

    if (nextProps.game.opponentId) {
      const { firstName, _id, elo } = user;
      this.setupSocket(`gameId=${nextProps.game.id}&username=${firstName}&userId=${_id}&userElo=${elo}`);
    } else {
      this.setupSocket(`gameId=${nextProps.game.id}`);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    clearTimeout(this.botTimeout);
  }  

  findGame = async () => {
    if (!this.props.userId || this.state.matchmaking) { return; }
    this.setState({ status: "matchmaking" });
    await this.props.dispatch(findGameAction(this.props.userId));
    this.botTimeout = setTimeout(() => this.playBot(), 5000);
  }   

  setupSocket(query) {
    console.log(`${query.includes("&username") ? "Joining" : "Creating"} game room: ${query}.`);

    const socket = io.connect("https://dry-ocean-39738.herokuapp.com", { query: query });

    socket.on("joined", opponent => {
      clearTimeout(this.botTimeout);
      
      if (!_.has(this.props.game, "opponentId")) {
        const game = { game: _.extend(this.props.game, opponent) };
        this.props.dispatch(updateEntityAction("game", game));
      }

      this.setState(
        { status: "matched" },
        () => this.startGame(COUNTDOWN_DELAY)
      );
    }); 
  }

  playBot() {
    const bot = new Bot(15);
    const botParams = {
      playAgainstBot: true,
      opponentUsername: bot.username,
      opponentElo: bot.elo
    };
    this.setState({ status: "matched" });
    const game = { game: _.extend(this.props.game, botParams) };
    this.props.dispatch(updateEntityAction("game", game));    
    this.startGame(COUNTDOWN_DELAY);
  }

  startGame(countdown) {
    this.setState({ countdown }, () => {
      this.interval = setInterval(() => {
        countdown--;
        this.setState(countdown === 0 ? { redirect: `/play/type=battle`} : { countdown });
      }, 1000);
    });
  }

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }

    const {
      countdown,
      status
    } = this.state;

    const {
      user,
      game
    } = this.props;

    console.log(game)

    const playerInfo = (username, elo) => username && elo && <p>
      {username} <span style={{color:color.red}}>{elo}</span>
    </p>;

    return (
      <Container>
        {playerInfo(get(user, "firstName"), get(user, "elo"))}
        {playerInfo(get(game, "opponentUsername"), get(game, "opponentElo"))}
        {
          status === "none"
          ?
          <Button.medium
            style={{backgroundColor:BUTTON_DATA[status].color,width:"300px"}}
            onClick={this.findGame.bind(this)}>
            {BUTTON_DATA[status].text}
          </Button.medium>
          :
          <div style={{textAlign:"left",width:"300px"}}>
            <svg height="80" width="80" style={{display:"inline-block"}}>
              <g>
                <Circle
                  animate={status === "matchmaking"}
                  strokeColor={BUTTON_DATA[status].color}
                  cx="40" cy="40" r="30">
                </Circle>
                <text x="50%" y="50%" textAnchor="middle" stroke={color.red} strokeWidth="2px" dy=".3em">
                  {status === "matched" ? countdown : ""}
                </text>
              </g>
            </svg>
            <Text color={BUTTON_DATA[status].color}>
              {BUTTON_DATA[status].text}
            </Text>
          </div>
        }
      </Container>
    );
  }
}
const Text = styled.p`
  letter-spacing: 2px;
  text-transform: uppercase;
  font-family: BrandonGrotesqueBold;
  color: ${props => props.color};
  height: 80px;
  line-height: 80px;
  vertical-align: top;
  margin: 0;
  margin-left: 20px;
  display: inline-block;
`

const dashoffset = keyframes`
  to {
    stroke-dashoffset: 0;
  }
`;

const Circle = styled.circle`
  fill: white;
  stroke: ${props => props.strokeColor};
  stroke-width: 6;
  stroke-dasharray: 250;
  stroke-dashoffset: 1000;
  animation: ${props => props.animate ? `${dashoffset} 5s linear infinite` : ''};
`

const Container = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: -40px;
  ${media.phone`
    padding: 0;
    min-height: 80vh;
  `}; 
`

const mapStateToProps = (state, ownProps) => ({
  user: _.first(_.values(state.entities.user)),
  userId: get(state.entities.session, "user"),
  game: _.first(_.values(state.entities.game))
});

export default connect(mapStateToProps)(Battle);
