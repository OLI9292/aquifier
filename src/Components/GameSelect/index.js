import { connect } from 'react-redux'
import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';

import dummyIcon from '../../Library/Images/archer.png';
import { stats } from './stats';
import Train from './Train/index';
import Explore from './Explore/index';
import Read from './Read/index';
import { color } from '../../Library/Styles/index';
import flatMap from 'lodash/flatMap';
import { loadLevels, loadWordLists, loadLessons } from '../../Actions/index';

import {
  Container, GrayLine, TabContainer, Tab, Main, Content, Sidebar, SidebarContainer,
  Header, LeaderboardListItem, ProgressListItem, Icon, StatName, Stat
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
    const mainComponent = {
      train: <Train 
        user={this.props.user} 
        levels={this.props.levels} />,
      explore: <Explore
        levels={this.props.wordLists} />,
      read: <Read
        levels={this.props.lessons} />
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

    const statList = (forLeaderboards = true) => {
      return <ul style={{listStyle:'none',margin:'0 auto',width:'60%',padding:'0'}}>
        {flatMap(stats[forLeaderboards ? 'leaderboards' : 'progress'], data => {
          const ListItem = forLeaderboards ? LeaderboardListItem : ProgressListItem;
          return <ListItem key={data.slug}>
            <Icon src={data.image} />
            {data.name && <StatName>{data.name}</StatName>}
            <Stat color={data.color} forLeaderboards={forLeaderboards}>
              {data.seed}
            </Stat>
          </ListItem>
        })}
      </ul>
    }

    const leaderboardStats = (() => {
      return <SidebarContainer>
        <Header>
          Leaderboards
        </Header>
        {statList()}
      </SidebarContainer>
    })();

    const progressStats = (() => {
      return <SidebarContainer>
        <Header>
          Progress
        </Header>
        {statList(false)}
      </SidebarContainer>
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
          {leaderboardStats}
          {progressStats}
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
