import { Redirect } from 'react-router';
import React, { Component } from 'react';
import { connect } from 'react-redux'
import get from "lodash/get";
import styled from 'styled-components';
import _ from 'underscore';


import Bot from '../../../Models/Bot';
import AddFriends from './addFriends';
import FriendSearch from './friendSearch';
import CONFIG from '../../../Config/main';
import Button from '../../Common/button';
import Header from '../../Common/header';
import { shouldRedirect } from '../../../Library/helpers';
import { color, media } from '../../../Library/Styles/index';

import {
  ArenaContainer,
  Circle,
  Text
} from './components';

import {
  findGameAction,
  fetchUserAction,
  removeEntityAction,
  updateEntityAction
} from '../../../Actions/index';

const USER_ACTIONS = {
  NONE: 1,
  SEARCHING: 2,
  FOUND_GAME: 3,
  CHALLENGE_FRIEND: 4,
  WAITING_FOR_FRIEND: 5,
  ADD_FRIEND: 6,
  VIEWING_CHALLENGE: 7
};

const COUNTDOWN_DELAY = 3;

class Battle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUserAction: USER_ACTIONS.NONE
    };
  }

  componentDidMount() {
    this.props.onRef(this);
    this.props.dispatch(removeEntityAction('game'));

    if (window.location.search.includes("searchImmediately=true")) {
      this.findGame();
    }
  }

  componentWillReceiveProps(nextProps) {
    /*const {
      user,
      game
    } = this.props;

    if (_.isEqual(game, nextProps.game) || !nextProps.game || !user) { return; }

    if (nextProps.game.opponentId) {
      const { firstName, _id, elo } = user;
      this.setupSocket(`gameId=${nextProps.game.id}&username=${firstName}&userId=${_id}&userElo=${elo}`);
    } else {
      this.setupSocket(`gameId=${nextProps.game.id}`);
    }*/
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
    clearInterval(this.interval);
    clearTimeout(this.botTimeout);
  }  

  addFriend(data) {
    console.log("add friend")
    console.log(data)
  }

  removeFriend(id) {
    console.log("remove friend")
    console.log(id)
  }  

  findGame = async () => {
    if (!this.props.userId || this.state.matchmaking) { return; }
    this.setState({ currentUserAction: USER_ACTIONS.SEARCHING });
    await this.props.dispatch(findGameAction(this.props.userId));
    this.botTimeout = setTimeout(() => this.playBot(), 5000);
  }   

  receiveChallenge(opponent) {
    console.log("receiveChallenge")
    console.log(opponent)
    this.setState({
      currentUserAction: USER_ACTIONS.VIEWING_CHALLENGE,
      opponent: {
        id: opponent.userId,
        elo: opponent.userElo,
        username: opponent.username,
      }
    });
  }

  submitChallenge(opponent) {
    this.setState({
      currentUserAction: USER_ACTIONS.WAITING_FOR_FRIEND,
      opponent: {
        id: opponent._id,
        elo: opponent.elo,
        username: opponent.username,
      }
    });    
  }

  /*setupSocket(query) {

    return;

    console.log(`${query.includes("&username") ? "Joining" : "Creating"} game room: ${query}.`);

    const socket = io.connect("http://localhost:3002"/*"https://dry-ocean-39738.herokuapp.com", { query: query });

    socket.on("joined", opponent => {
      clearTimeout(this.botTimeout);
      
      if (!_.has(this.props.game, "opponentId")) {
        const game = { game: _.extend(this.props.game, opponent) };
        this.props.dispatch(updateEntityAction("game", game));
      }

      this.setState(
        { currentUserAction: USER_ACTIONS.FOUND_GAME },
        () => this.startGame(COUNTDOWN_DELAY)
      );
    }); 
  }*/

  playBot() {
    const bot = new Bot(15);
    const botParams = {
      playAgainstBot: true,
      opponentUsername: bot.username,
      opponentElo: bot.elo
    };
    this.setState({ currentUserAction: USER_ACTIONS.FOUND_GAME });
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
      currentUserAction,
      opponent
    } = this.state;

    const {
      user,
      game
    } = this.props;

    const playerInfo = (username, elo) => username && elo && <p>
      {username} <span style={{color:color.red}}>{elo}</span>
    </p>;

    const versus = <svg height={"50"} width={"50"}>
      <g>
        <circle fill={color.red} cx={"25"} cy={"25"} r={"20"}>
          <p>
            vs
          </p>
        </circle>
        <text x="50%" y="50%" textAnchor="middle" stroke={"white"} strokeWidth="1px" dy=".3em">
          vs
        </text>    
      </g>
    </svg>;

    const component = () => {
      if (currentUserAction === USER_ACTIONS.NONE) {

        return <ArenaContainer>
          {playerInfo(get(user, "username"), get(user, "elo"))}
          {playerInfo(get(game, "opponentUsername"), get(game, "opponentElo"))}        
          <Button.medium
            style={{backgroundColor:color.blue,width:"300px"}}
            onClick={this.findGame.bind(this)}>
            find game
          </Button.medium>
          <Button.medium
            style={{backgroundColor:color.green,width:"300px",marginTop:"20px"}}
            onClick={() => this.setState({ currentUserAction: USER_ACTIONS.CHALLENGE_FRIEND })}>
            challenge friend
          </Button.medium>
          <Button.medium
            style={{backgroundColor:"white",color:color.mediumLGray,width:"300px"}}
            onClick={() => this.setState({ currentUserAction: USER_ACTIONS.ADD_FRIEND })}>
            add friends
          </Button.medium>          
        </ArenaContainer>;

      } else if ([USER_ACTIONS.SEARCHING, USER_ACTIONS.FOUND_GAME].includes(currentUserAction)) {

        const [coloring, t1, t2] = currentUserAction === USER_ACTIONS.SEARCHING
          ? [color.warmYellow, "", "searching"]
          : [color.red, countdown, "game found"];
        
        return <ArenaContainer>
          {playerInfo(get(user, "firstName"), get(user, "elo"))}
          {playerInfo(get(game, "opponentUsername"), get(game, "opponentElo"))}
          <div style={{textAlign:"left",width:"300px"}}>
            <svg height="80" width="80" style={{display:"inline-block"}}>
              <g>
                <Circle animate={currentUserAction === USER_ACTIONS.SEARCHING} strokeColor={coloring} cx="40" cy="40" r="30">
                </Circle>
                <text x="50%" y="50%" textAnchor="middle" stroke={color.red} strokeWidth="2px" dy=".3em">
                  {t1}
                </text>
              </g>
            </svg>
            <Text color={coloring}>
              {t2}
            </Text>
          </div>
        </ArenaContainer>;

      } else if (currentUserAction === USER_ACTIONS.CHALLENGE_FRIEND) {

        return <AddFriends
          challengeFriend={this.props.challengeFriend}
          addFriends={() => this.setState({ currentUserAction: USER_ACTIONS.ADD_FRIEND })}
          onlineClientIds={this.props.onlineClientIds || []}
          friends={get(user, "friends") || []} />;

      } else if (currentUserAction === USER_ACTIONS.ADD_FRIEND) {

        return <FriendSearch
          addFriend={this.addFriend.bind(this)} />;

      } else if ([USER_ACTIONS.WAITING_FOR_FRIEND, USER_ACTIONS.VIEWING_CHALLENGE].includes(currentUserAction)) {
        const isWaiting = currentUserAction === USER_ACTIONS.WAITING_FOR_FRIEND;

        return <ArenaContainer>
          <Header.medium>
            {isWaiting ? 'challenge sent!' : 'new challenge!'}
          </Header.medium>
          {playerInfo(get(user, "username"), get(user, "elo"))}
          {versus}
          {playerInfo(get(opponent, "username"), get(opponent, "elo"))}
          {
            isWaiting
              ? 
              <div>
                <Button.medium style={{color:color.gray2,backgroundColor:"white",width:"300px",pointerEvents:"none"}}>
                  waiting...
                </Button.medium>
                <Button.medium
                  onClick={() => {}/*TODO*/}
                  style={{color:color.gray2,backgroundColor:"white",width:"300px"}}>
                  leave
                </Button.medium>                
              </div>
              :
              <div>
                <Button.medium
                  onClick={() => this.props.acceptChallenge(opponent)}
                  style={{backgroundColor:color.green,width:"300px"}}>
                  accept
                </Button.medium>
                <Button.medium
                  onClick={() => {}/*TODO*/}
                  style={{color:color.gray2,backgroundColor:"white",width:"300px"}}>
                  decline
                </Button.medium>              
              </div>
          }
        </ArenaContainer>;
      }
    }

    return component();
  }
}

const mapStateToProps = (state, ownProps) => ({
  user: _.first(_.values(state.entities.user)),
  userId: get(state.entities.session, "user"),
  game: _.first(_.values(state.entities.game))
});

export default connect(mapStateToProps)(Battle);
