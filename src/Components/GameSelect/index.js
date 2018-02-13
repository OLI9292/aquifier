import _ from 'underscore';
import { connect } from 'react-redux'
import React, { Component } from 'react';

import MiniLeaderboard from './miniLeaderboard';
import MiniProgress from './miniProgress';
import Train from './Train/index';
import Explore from './Explore/index';
import Read from './Read/index';

import { color } from '../../Library/Styles/index';
import flatMap from 'lodash/flatMap';
import { loadLevels, loadWordLists, loadLessons } from '../../Actions/index';

import {
  Container,
  Content,
  GrayLine,
  Header,
  Main,
  Tab,
  TabContainer,
  Sidebar
} from './components'

const GAME_TYPES = ['train', 'explore', 'read', 'join game'];

class GameSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameType: GAME_TYPES[0]
    };
  }

  componentDidMount() {
    if (_.isEmpty(this.props.levels)) { this.props.dispatch(loadLevels()); }
  }

  switchTab(gameType) {
    if (this.state.gameType !== gameType) {
      const action = {
        'train': loadLevels,
        'explore': loadWordLists,
        'read': loadLessons
      }[gameType];    
      if (action) { this.props.dispatch(action()) };
      this.setState({ gameType });
    } 
  }

  render() {
    const {
      lessons,
      levels,
      session,
      wordLists,
      user
    } = this.props;

    const mainComponent = {
      train: <Train 
        user={user} 
        levels={levels} />,
      explore: <Explore
        levels={wordLists} />,
      read: <Read
        levels={lessons} />
    }[this.state.gameType];

    const tabs = (() => {
      return <TabContainer>
        {_.map(GAME_TYPES, (gameType, i) => {
          const margin = i === 1 ? '0px 5px 0px 10px' : i === 2 ? '0px 10px 0px 5px' : '0';
          return <Tab
            key={i}
            onClick={() => this.switchTab(gameType)}
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
  levels: _.values(state.entities.levels),
  wordLists: _.values(state.entities.wordLists),
  lessons: _.values(state.entities.lessons)
});

export default connect(mapStateToProps)(GameSelect);
