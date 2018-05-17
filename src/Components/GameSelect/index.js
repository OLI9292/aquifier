import { Redirect } from 'react-router';
import _ from 'underscore';
import { connect } from 'react-redux'
import React, { Component } from 'react';
import get from "lodash/get";

import Header from '../Common/header';
import { shouldRedirect } from '../../Library/helpers'
import MiniLeaderboard from './miniLeaderboard';
import MiniProgress from './miniProgress';
import MiniProgressMobile from './miniProgressMobile';
import Train from './Train/index';
import JoinGame from './JoinGame/index';
import Battle from './Battle/index';
import Socket from "../../Models/Socket";

import { fetchLevelsAction } from '../../Actions/index';

import {
  Container,
  Content,
  Main,
  MiniProgressMobileContainer,
  Tab,
  TabContainer,
  Sidebar
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
    // TODO: - uncomment
    //window.addEventListener('scroll', this.checkScroll);    
    if (_.isEmpty(this.props.levels)) { this.props.dispatch(fetchLevelsAction()); }
    console.log("mounting")
    this.joinGameLobby(this.props);
  }

  componentWillUnmount() {
    // socket.disconnect();
    window.removeEventListener('scroll', this.checkScroll);
  }  

  joinGameLobby(props) {
    this.setState({ didJoinGameLobby: true }, this.setupSocket);      
  }

  setupSocket() {
    const query = { userId: get(this.props.session, "user") };
    this.socket = new Socket({ query: query }, true);
    this.socket.registerHandler(this.onMessageReceived.bind(this));    
  }

  onMessageReceived(message) {
    switch (message.type) {
      case this.socket.MESSAGE_TYPES.ONLINE_CLIENTS: 
        return this.setState({ onlineClientIds: message.data });
      
      case this.socket.MESSAGE_TYPES.CHALLENGE_REQUEST: 
        return this.arena.receiveChallenge(message.data);
    }
  }

  acceptChallenge(opponent) {
    this.socket.acceptChallenge(this.props.user._id, opponent.id);
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
      session,
      user
    } = this.props;

    const mainComponent = {
      battle: <Battle
        onRef={ref => (this.arena = ref)}
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

    const sidebarStyles = this.state.gameType === 'train'
      ? { position: 'fixed', width: '250px', bottom: this.state.fixedSidebar ? '' : '120px' }
      : { width: '250px' };

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

        <Sidebar>
          <div
            style={sidebarStyles} 
            ref={sidebar => this.sidebar = sidebar}>
            {user && session && <MiniLeaderboard user={user} session={session} />}
            <br />
            {user && <MiniProgress user={user} />}
          </div>
        </Sidebar>
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  session: state.entities.session,
  user: _.first(_.values(state.entities.user)),
  levels: _.values(state.entities.levels)
});

export default connect(mapStateToProps)(GameSelect);
