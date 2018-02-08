import { connect } from 'react-redux'
import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';

import dummyIcon from '../../Library/Images/archer.png';
import { stats } from './stats';
import Train from './train';
import { color } from '../../Library/Styles/index';
import flatMap from 'lodash/flatMap';
import { fetchLevels } from '../../Actions/index';

const GAME_TYPES = ['train', 'explore', 'read', 'join game'];

class GameSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameType: GAME_TYPES[0]
    };
  }

  componentDidMount() {
    if (_.isEmpty(this.props.levels)) { this.props.dispatch(fetchLevels()); }
  }

  switchTab(gameType) {
    if (this.state.gameType !== gameType) {
      const action = {
        'train': fetchLevels
      }[gameType];    
      if (action) { this.props.dispatch(action()) };
      this.setState({ gameType });
    } 
  }

  render() {
    const mainComponent = {
      train: <Train levels={this.props.levels} />,
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
      return <ul style={{listStyle:'none',margin:'0',padding:'0'}}>
        {flatMap(stats[forLeaderboards ? 'leaderboards' : 'progress'], data => {
          const ListItem = forLeaderboards ? LeaderboardListItem : ProgressListItem;
          return <ListItem key={data.slug}>
            <Icon src={data.image} />
            {data.name && <StatName>{data.name}</StatName>}
            <Stat color={data.color} forLeaderboards={forLeaderboards}>
              0
            </Stat>
          </ListItem>
        })}
      </ul>
    }

    const leaderboardStats = (() => {
      return <Leaderboards>
        <Header>
          Leaderboards
        </Header>
        {statList()}
      </Leaderboards>
    })();

    const progressStats = (() => {
      return <Progress>
        <Header>
          Progress
        </Header>
        {statList(false)}
      </Progress>
    })();
    
    return (
      <Container>
        <Main>
          {tabs}
          <Content>
            <div style={{position:'absolute',width:'100%',height:'20px',backgroundColor:'white'}}></div>
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

const Container = styled.div`
  display: flex;
  padding-top: 40px;
`

const TabContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: -40px;
`

const Tab = styled.div`
  flex: 1;
  font-size: 0.8em;
  cursor: pointer;
  height: 50px;
  line-height: 42px;
  text-align: center;
  background-color: ${props => props.selected ? color.red : color.lightBlue};
  color: white;
  border-radius: 10px;
  font-family: BrandonGrotesqueBold;
  margin: ${props => props.margin};
`

const Main = styled.div`
  flex: 2.5;
  margin-right: 25px;
  position: relative;
`

const Content = styled.div`
  width: 100%;
  background-color: white;
  border-radius: 20px;
  z-index: 5;
`

const Sidebar = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const Leaderboards = styled.div`
  background-color: white;
  margin-bottom: 25px;
  border-radius: 20px;
`

const Progress = styled.div`
  background-color: white;
  border-radius: 20px;
`

const Header = styled.h3`
  text-align: center;
`

const LeaderboardListItem = styled.li`
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ProgressListItem = styled.li`
  height: 100px;
  text-align: center
`

const Icon = styled.img`
  height: 30px;
  width: auto;
`

const StatName = styled.div`
  height: 0px;
  line-height: 0px;
`

const Stat = styled.p`
  line-height: ${props => props.forLeaderboards ? '' : '0px'};
  height: ${props => props.forLeaderboards ? '' : '0px'};
  font-family: EBGaramond;
  color: ${props => props.color};
  font-size: ${props => props.forLeaderboards ? '1.75em' : '1.25em'};
`


const mapStateToProps = (state, ownProps) => ({
  session: state.entities.session,
  user: _.first(_.values(state.entities.user)),
  levels: _.values(state.entities.levels)
});

export default connect(mapStateToProps)(GameSelect);
