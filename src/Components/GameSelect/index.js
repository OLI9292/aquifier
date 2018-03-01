import _ from 'underscore';
import { connect } from 'react-redux'
import React, { Component } from 'react';

import MiniLeaderboard from './miniLeaderboard';
import MiniProgress from './miniProgress';
import MiniProgressMobile from './miniProgressMobile';
import Train from './Train/index';
import JoinGame from './JoinGame/index';
import Explore from './Explore/index';

import { fetchLevelsAction } from '../../Actions/index';

import {
  Container,
  Content,
  GrayLine,
  Main,
  MiniProgressMobileContainer,
  Tab,
  TabContainer,
  Sidebar
} from './components'

const GAME_TYPES = ['train', 'explore', 'join game'];

class GameSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameType: GAME_TYPES[0]
    };
  }

  componentDidMount() {
    if (_.isEmpty(this.props.levels)) { this.props.dispatch(fetchLevelsAction()); }
  }

  render() {
    const {
      levels,
      session,
      user
    } = this.props;

    const mainComponent = {
      train: <Train 
        user={user} 
        levels={_.filter(levels, l => _.contains(['train', 'speed'], l.type))} />,
      explore: <Explore
        levels={_.filter(levels, l => l.type === 'topic')} />,
      'join game': <JoinGame />,
    }[this.state.gameType];

    const tabs = (() => {
      return <TabContainer>
        {_.map(GAME_TYPES, (gameType, i) => {
          const margin = i === 1 ? '0px 20px 0px 20px' : '0';
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
    
    return (
      <Container>
        <Main>
          {tabs}
          <Content>
            <GrayLine />
            <MiniProgressMobileContainer>
              {user && <MiniProgressMobile user={user} />}
            </MiniProgressMobileContainer>
            {mainComponent}
          </Content>
        </Main>
        <Sidebar>
          {user && session && <MiniLeaderboard user={user} session={session} />}
          {user && <MiniProgress user={user} />}
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
