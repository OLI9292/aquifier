import _ from 'underscore';
import { connect } from 'react-redux'
import queryString from 'query-string';
import React, { Component } from 'react';
import get from 'lodash/get';

import { color } from '../../Library/Styles/index';
import { fetchLeaderboardsAction } from '../../Actions/index';
import { getOrdinalPosition } from '../../Library/helpers';

import {
  Icon,
  Header,
  LeaderboardListItem,
  Stat,
  StatName,
  SidebarContainer
} from './components'

const STATS = [
  {
    slug: 'classAllTime',
    image: require('../../Library/Images/icon-house.png'),
    color: color.red
  },
  {
    slug: 'earthAllTime',
    image: require('../../Library/Images/icon-earth.png'),
    color: color.mainBlue
  }
]

class MiniLeaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.loadLeaderboard(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.loadLeaderboard(nextProps);
  }

  loadLeaderboard = async props => {
    const userId = get(props.user, "_id");
    const classId = get(_.last(get(props.user, "classes")), "id");
    if (!userId || !classId || !props.session || this.state.loadedLeaderboard) { return; }
    this.setState({ loadedLeaderboard: true });
    const query = `userId=${userId}&classId=${classId}`;
    const result = await this.props.dispatch(fetchLeaderboardsAction(query, props.session));    
    if (result.error) { return; }
    const ranks = result.response.entities;
    this.setState({
      earthAllTime: this.getPosition(ranks, false, false),
      classAllTime: this.getPosition(ranks, true, false)
    })
  }

  getPosition(ranks, isClass, isWeekly) {
    const position = get(_.find(ranks, rank => rank.isWeekly === isWeekly && rank.isClass === isClass), "position");
    return getOrdinalPosition(position);
  }

  render() {
    return (
      <SidebarContainer>
        <Header>
          Leaderboards
        </Header>
        <ul style={{listStyle:'none',margin:'0 auto',width:'50%',padding:'0px 0px 10px 0px'}}>
          {_.map(STATS,  data => {
            return <LeaderboardListItem key={data.slug}>
              <Icon src={data.image} />
              <StatName>
                {data.name}
              </StatName>
              <Stat color={data.color} forLeaderboards={true}>
                {this.state[data.slug] || 'N/A'}
              </Stat>
            </LeaderboardListItem>
          })}
        </ul>
      </SidebarContainer>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  ranks: _.values(state.entities.ranks),
  user: _.first(_.values(state.entities.user))
})

export default connect(mapStateToProps)(MiniLeaderboard)
