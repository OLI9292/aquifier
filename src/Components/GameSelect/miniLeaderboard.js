import _ from 'underscore';
import { connect } from 'react-redux'
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
    slug: 'allTimeClass',
    image: require('../../Library/Images/icon-house.png'),
    color: color.red
  },
  {
    slug: 'allTimeEarth',
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

  loadLeaderboard(props) {
    const userId = get(props.user, "_id");
    const classId = get(_.first(get(props.user, "classes")), "id");
    if (!userId || !classId || !props.session || this.state.loadedLeaderboard) { return; }
    this.setState({ loadedLeaderboard: true });
    const query = `userId=${userId}&classId=${classId}&onlyUser=true`;
    this.props.dispatch(fetchLeaderboardsAction(query, props.session));    
  }

  getPosition(ranks, attr) {
    const rank = get(ranks, attr);
    return rank ? getOrdinalPosition(rank) : 'N/A';
  }

  render() {
    const { 
      ranks
    } = this.props;

    const stat = data => <LeaderboardListItem key={data.slug}>
      <Icon src={data.image} />
      <StatName>
        {data.name}
      </StatName>
      <Stat 
        color={data.color}
        forLeaderboards={true}>
        {this.getPosition(ranks, data.slug)}
      </Stat>
    </LeaderboardListItem>;

    return (
      <SidebarContainer>
        <Header>
          Leaderboards
        </Header>
        <ul style={{listStyle:'none',margin:'0 auto',width:'50%',padding:'0px 0px 10px 0px'}}>
          {_.map(STATS, stat)}
        </ul>
      </SidebarContainer>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  ranks: state.entities.ranks,
  user: _.first(_.values(state.entities.user))
})

export default connect(mapStateToProps)(MiniLeaderboard)
