import { Redirect } from 'react-router';
import _ from 'underscore';
import { connect } from 'react-redux'
import React, { Component } from 'react';
import get from "lodash/get";

import Header from '../Common/header';
import { shouldRedirect } from '../../Library/helpers'
// import MiniLeaderboard from './miniLeaderboard';
// import MiniProgress from './miniProgress';
// import MiniProgressMobile from './miniProgressMobile';
import Train from './Train/index';
import JoinGame from './JoinGame/index';
import Battle from './Battle/index';
import Socket from "../../Models/Socket";

import { fetchLevelsAction } from '../../Actions/index';

import {
  Container,
  Content,
  Main,
  Tab,
  TabContainer
} from './components';

const GAME_TYPES = ['battle', 'train', 'join'];

class GameSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameType: GAME_TYPES[0],
      fixedSidebar: true
    };

    this.checkScroll = this.checkScroll.bind(this);    
  }

  componentDidMount() {
    // window.addEventListener('scroll', this.checkScroll);    
    // if (_.isEmpty(this.props.levels)) { this.props.dispatch(fetchLevelsAction()); }
    this.setupSocket(this.props);
  }

  componentWillUnmount() {
    // window.removeEventListener('scroll', this.checkScroll);
  }  

  componentWillReceiveProps(nextProps) {
    this.setupSocket(nextProps);    
  }

  // Join game lobby
  setupSocket(props) {
    if (!props.session || this.state.socketSetup) { return; }
    this.setState({ socketSetup: true });
    this.socket = new Socket({ query: { userId: props.session.user } });
    this.socket.registerHandler(this.onMessageReceived.bind(this));    
  }

  // Respond to web socket messages
  onMessageReceived(message) {
    switch (message.type) {
      case this.socket.MESSAGE_TYPES.ONLINE_CLIENTS: 
        return this.setState({ onlineClientIds: message.data });
      
      case this.socket.MESSAGE_TYPES.CHALLENGE_REQUEST: 
        return this.arena.receiveChallenge(message.data);
      
      case this.socket.MESSAGE_TYPES.START_GAME: 
        return this.arena.startGame(message.data.room, message.data.opponent);

      default:
        break
    }
  }

  acceptChallenge(opponent) {
    this.socket.acceptChallenge(this.props.user._id, opponent._id);
  }

  initiateRandomGame(userId, opponentId) {
    this.socket.initiateRandomGame(userId, opponentId); 
  }

  challengeFriend(opponent) {
    this.arena.submitChallenge(opponent);
    this.socket.submitChallenge(this.props.user, opponent._id);
  }

  checkScroll() {
    if (!this.sidebar || !this.container) { return; }
    const sidebarBottom = this.sidebar.getBoundingClientRect().bottom + (this.state.fixedSidebar ? 0 : 120);
    const containerBottom = this.container.getBoundingClientRect().bottom;
    const fixedSidebar = containerBottom > sidebarBottom;
    if (fixedSidebar !== this.state.fixedSidebar) { this.setState({ fixedSidebar }); }
  }

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }    

    const {
      levels,
      user
    } = this.props;

    const mainComponent = {
      battle: <Battle
        onRef={ref => (this.arena = ref)}
        initiateRandomGame={this.initiateRandomGame.bind(this)}
        acceptChallenge={this.acceptChallenge.bind(this)}
        challengeFriend={this.challengeFriend.bind(this)}
        onlineClientIds={this.state.onlineClientIds}
        user={user} />,
      train: <Train 
        user={user} 
        levels={_.filter(levels, l => _.contains(['train', 'speed'], l.type))} />,
      join: <JoinGame />,
    }[this.state.gameType];

    const tab = (gameType, idx) => <Tab
      key={idx}
      onClick={() => this.setState({ gameType })}
      selected={this.state.gameType === gameType}
      margin={idx === 1 ? '0px 3px' : '0'}>
      {gameType}
    </Tab>;

    return (
      <Container ref={container => this.container = container}>

        <Header.medium style={{textAlign:"center"}}>
          play
        </Header.medium>

        <Main>
          <TabContainer>
            {_.map(GAME_TYPES, (gameType, idx) => tab(gameType, idx))}
          </TabContainer>

          <Content>
            {mainComponent}
          </Content>
        </Main>
      </Container>
    );
  }
}
/*
        <Sidebar>
          <div
            style={sidebarStyles} 
            ref={sidebar => this.sidebar = sidebar}>
            {user && session && <MiniLeaderboard user={user} session={session} />}
            <br />
            {user && <MiniProgress user={user} />}
          </div>
        </Sidebar>
        */
const mapStateToProps = (state, ownProps) => ({
  session: state.entities.session,
  user: _.first(_.values(state.entities.user)),
  levels: _.values(state.entities.levels)
});

export default connect(mapStateToProps)(GameSelect);
