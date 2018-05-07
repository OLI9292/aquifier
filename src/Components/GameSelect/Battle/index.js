import { Redirect } from 'react-router';
import React, { Component } from 'react';
import { connect } from 'react-redux'
import get from "lodash/get";
import styled, { keyframes } from 'styled-components';
import _ from 'underscore';

import io from 'socket.io-client';

import CONFIG from '../../../Config/main';
import Button from '../../Common/button';
import { shouldRedirect } from '../../../Library/helpers';
import { color, media } from '../../../Library/Styles/index';

import {
  joinGameAction,
  fetchUserAction
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

  findOpponent() {
    if (!this.props.userId || this.state.matchmaking) { return; }

    this.setState(
      { status: "matchmaking" },
      () => this.findGame(this.props.userId)
    );
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.opponent, nextProps.opponent)) {
      this.setState({ status: "matched" });
    }
  }

  findGame = async userId => {
    const result = await this.props.dispatch(joinGameAction(userId));
    if (result.error) { return; }

    const opponent = _.first(_.values(get(result.response.entities, "opponent")));

    const query = opponent
      ? `player1=${opponent._id}&player2=${userId}`
      : `player1=${userId}`;
    this.setupSocket(query);
  }

  startGame(countdown, gameId) {
    this.setState({ countdown }, () => setTimeout(() => {

      this.interval = setInterval(() => {
        let countdown = this.state.countdown;
        countdown--;
        if (countdown === 0) {
          clearInterval(this.interval);
          this.setState({ redirect: `/play/type=battle&id=${gameId}`})
        } else {
          this.setState({ countdown });
        }
      }, 1000);

    }, 200));
  }

  setupSocket(query) {
    console.log(`${query.includes("&player2") ? "Joining" : "Creating"} game room.`);

    const socket = io.connect("https://dry-ocean-39738.herokuapp.com", { query: query });

    socket.on("joined", id => { 
      if (!this.props.opponent) { this.props.dispatch(fetchUserAction(id, true)); }
      this.startGame(COUNTDOWN_DELAY, id);
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
      opponent
    } = this.props;

    return (
      <Container>
        {
          status === "none"
          ?
          <Button.medium
            style={{backgroundColor:BUTTON_DATA[status].color,width:"300px"}}
            onClick={this.findOpponent.bind(this)}>
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
/*
        <div>
          <p>
            {get(opponent, "firstName")}
          </p>
        </div>
        */
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
  opponent: _.first(_.values(state.entities.opponent))
});

export default connect(mapStateToProps)(Battle);
