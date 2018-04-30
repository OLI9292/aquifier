import { Redirect } from 'react-router';
import _ from 'underscore';
import { connect } from 'react-redux'
import React, { Component } from 'react';

import { shouldRedirect } from '../../Library/helpers'
import MiniLeaderboard from './miniLeaderboard';
import MiniProgress from './miniProgress';
import MiniProgressMobile from './miniProgressMobile';
import Train from './Train/index';
import JoinGame from './JoinGame/index';
import Battle from './Battle/index';

import { fetchLevelsAction } from '../../Actions/index';

import {
  Content,
  GrayLine,
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
    if (!this.props.session) { this.setState({ redirect: '/' }); }
    window.addEventListener('scroll', this.checkScroll);    
    if (_.isEmpty(this.props.levels)) { this.props.dispatch(fetchLevelsAction()); }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.checkScroll);
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
      battle: <Battle user={user} />,
      train: <Train 
        user={user} 
        levels={_.filter(levels, l => _.contains(['train', 'speed'], l.type))} />,
      join: <JoinGame />,
    }[this.state.gameType];

    const tabs = (() => {
      return <TabContainer>
        {_.map(GAME_TYPES, (gameType, i) => {
          const margin = i === 1 ? '0px 5px' : '0';
          return <Tab
            key={i}
            onClick={() => this.setState({ gameType })}
            selected={this.state.gameType === gameType}
            margin={margin}>
            {gameType.toUpperCase()}
          </Tab>
        })}
      </TabContainer>
    })();

    const sidebarStyles = this.state.gameType === 'train'
      ? { position: 'fixed', width: '250px', bottom: this.state.fixedSidebar ? '' : '120px' }
      : { width: '250px' };

    return (
      <div style={{display:'flex',paddingTop:'40px'}} ref={container => this.container = container}>
        <Main>
          {tabs}
          <Content>
            <GrayLine />
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
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  session: state.entities.session,
  user: _.first(_.values(state.entities.user)),
  levels: _.values(state.entities.levels)
});

export default connect(mapStateToProps)(GameSelect);
