import { Redirect } from 'react-router';
import React, { Component } from 'react';
import { connect } from 'react-redux'
import get from "lodash/get";
import _ from 'underscore';

import Bot from '../../../Models/Bot';
import ChallengeFriends from './challengeFriends';
import FriendSearch from './friendSearch';
import Button from '../../Common/button';
import Header from '../../Common/header';
import { shouldRedirect } from '../../../Library/helpers';
import { color } from '../../../Library/Styles/index';

import {
  ArenaContainer,
  Circle,
  Text,
  versus
} from './components';

import {
  findGameAction,
  addFriendAction,
  removeEntityAction,
  updateEntityAction,
  removeFriendAction
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

class Battle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUserAction: USER_ACTIONS.NONE
    };
  }

  componentDidMount() {
    this.props.dispatch(removeEntityAction("opponent"));
    this.props.onRef(this);

    if (window.location.search.includes("searchImmediately=true")) {
      this.findGame();
    }
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
    clearInterval(this.interval);
    clearTimeout(this.botTimeout);
  }  

  challengeFriend(data) {
    this.setState({ currentUserAction: USER_ACTIONS.CHALLENGE_FRIEND });
  }

  addFriends() {
    this.setState({ currentUserAction: USER_ACTIONS.ADD_FRIEND })
  }

  acceptChallenge() {
    this.props.acceptChallenge(this.props.opponent);
  }

  declineChallenge() {
    this.props.dispatch(removeEntityAction("opponent"));
    this.setState({ currentUserAction: USER_ACTIONS.NONE });
  }  

  leaveGame() {
    this.props.dispatch(removeEntityAction("opponent"));
    this.setState({ currentUserAction: USER_ACTIONS.NONE });
  }

  addFriend(data) {
    const params = { id: data._id, username: data.username, wins: 0, losses: 0 };
    this.props.dispatch(addFriendAction(this.props.userId, params));
    this.setState({ currentUserAction: USER_ACTIONS.CHALLENGE_FRIEND });
  }

  removeFriend(id) {
    this.props.dispatch(removeFriendAction(this.props.userId, id));
  }  

  // Start game after countdown
  startGame(room, opponent, countdown = 3) {
    clearTimeout(this.botTimeout);

    if (opponent && !this.props.opponent.foundOpponent) {
      this.props.dispatch(updateEntityAction({ opponent: opponent }));
    }

    this.setState({
      currentUserAction: USER_ACTIONS.FOUND_GAME,
      countdown: countdown
    });    

    const redirect = "/play/type=battle" + (room ? `&id=${room}` : "");

    this.interval = setInterval(() => {
      countdown--;
      this.setState(countdown ? { countdown } : { redirect });
    }, 1000);
  }

  findGame = async () => {
    this.setState({ currentUserAction: USER_ACTIONS.SEARCHING });

    const params = {
      id: this.props.userId,
      elo: this.props.user.elo,
      username: this.props.user.username
    };

    const result = await this.props.dispatch(findGameAction(params));
    const foundOpponent = !result.error && get(result.response.entities.opponent, "foundOpponent");
    
    if (foundOpponent) {
      const user = {
        id: this.props.userId,
        elo: this.props.user.elo,
        username: this.props.user.username
      };
      const opponentId = result.response.entities.opponent.id;
      this.props.initiateRandomGame(user, opponentId);
    } else {
      // Wait in queue for 5 seconds
      this.botTimeout = setTimeout(() => this.playBot(), 5000);
    }
  }   

  // Show new challenge modal
  receiveChallenge(opponent) {
    opponent = {
      _id: opponent.userId,
      elo: opponent.userElo,
      username: opponent.username,
    };
    this.props.dispatch(updateEntityAction({ opponent: opponent }));
    this.setState({ currentUserAction: USER_ACTIONS.VIEWING_CHALLENGE });        
  }

  // Show waiting for challenge modal
  submitChallenge(opponent) {
    this.setState({ currentUserAction: USER_ACTIONS.WAITING_FOR_FRIEND });    
    this.props.dispatch(updateEntityAction({ opponent: opponent }));  
  }

  playBot() {
    const bot = new Bot(15);
    
    const opponent = {
      _id: "cool-id",
      elo: bot.elo,
      username: bot.username,
      isBot: true 
    };

    this.props.dispatch(updateEntityAction({ opponent: opponent }));  
    this.setState({ currentUserAction: USER_ACTIONS.FOUND_GAME });
    this.startGame();
  }

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }

    const {
      countdown,
      currentUserAction
    } = this.state;

    const {
      user,
      game,
      opponent      
    } = this.props;

    const headerText = {
      5: "challenge sent!",
      7: "new challenge!"
    }[currentUserAction];

    const button = (text, bColor, cb) => <Button.medium
      style={{backgroundColor:bColor,width:"300px",color:bColor === "white" ? color.mediumLGray : "white",marginTop:"20px"}}
      onClick={cb.bind(this)}>
      {text}
    </Button.medium>;

    const circleAndText = isSearching => {
      const [coloring, t1, t2] = isSearching
        ? [color.warmYellow, "", "searching"]
        : [color.red, countdown, "game starting"];      
      return <div style={{textAlign:"left",width:"300px"}}>
        <svg height="80" width="80" style={{display:"inline-block"}}>
          <g>
            <Circle animate={isSearching} strokeColor={coloring} cx="40" cy="40" r="30">
            </Circle>
            <text x="50%" y="50%" textAnchor="middle" stroke={color.red} strokeWidth="2px" dy=".3em">
              {t1}
            </text>
          </g>
        </svg>
        <Text color={coloring}>
          {t2}
        </Text>
      </div>;     
    }

    return (
      <ArenaContainer>
        <Header.medium style={{color:color.mediumLGray,fontFamily:"BrandonGrotesque",height:"50px",lineHeight:"50px"}}>
          {headerText}
        </Header.medium>

        <div style={{height:"200px"}}>
          <p>
            {get(user, "username")} <span style={{color:color.red}}>{get(user, "elo")}</span>
          </p>
          {versus((user && opponent) ? "visible": "hidden")}
          <p>
            {get(opponent, "username")} <span style={{color:color.red}}>{get(opponent, "elo")}</span>
          </p>      
        </div>

        <div>
          {{
            1: (
              <div>
                {button("find game", color.blue, this.findGame)}
                {button("challenge friend", color.green, this.challengeFriend)}
                {button("add friends", "white", this.addFriends)}
              </div>
            ),
            2: (
              <div>
                {circleAndText(true)}
              </div>          
            ),
            3: (
              <div>
                {circleAndText(false)}
              </div>          
            ),
            4: (
              <ChallengeFriends
                removeFriend={this.removeFriend.bind(this)}
                exitModal={() => this.setState({ currentUserAction: USER_ACTIONS.NONE })}
                challengeFriend={this.props.challengeFriend}
                addFriends={() => this.setState({ currentUserAction: USER_ACTIONS.ADD_FRIEND })}
                onlineClientIds={this.props.onlineClientIds || []} />
            ),
            5: (
              <div>
                {button("leave", "white", this.leaveGame)}
              </div>          
            ),
            6: (
              <FriendSearch
                exitModal={() => this.setState({ currentUserAction: USER_ACTIONS.NONE })}
                addFriend={this.addFriend.bind(this)}
                onlineClientIds={this.props.onlineClientIds || []}   />
            ),
            7: (
              <div>
                {button("accept", color.green, this.acceptChallenge)}
                {button("decline", "white", this.declineChallenge)}
              </div>          
            )
          }[currentUserAction]}
        </div>
      </ArenaContainer>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  user: _.first(_.values(state.entities.user)),
  userId: get(state.entities.session, "user"),
  opponent: state.entities.opponent,
  game: _.first(_.values(state.entities.game))
});

export default connect(mapStateToProps)(Battle);
