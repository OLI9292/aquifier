import _ from 'underscore';
import { connect } from 'react-redux'
import queryString from 'query-string';
import React, { Component } from 'react';
import get from 'lodash/get';

import { color } from '../../Library/Styles/index';
import { loadLeaderboards } from '../../Actions/index';

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
    slug: 'earthAllTime',
    image: require('../../Library/Images/icon-earth.png'),
    color: color.mainBlue
  },
  {
    slug: 'schoolAllTime',
    image: require('../../Library/Images/icon-house.png'),
    color: color.red
  }
]

class MiniLeaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {
      ranks,
      session,
      user
    } = this.props

    if (_.isEmpty(ranks)) {
      const query = queryString.stringify(user.isTeacher ? { school: user.school } : { user: user._id });      
      this.props.dispatch(loadLeaderboards(query, session));
    } else {
      this.formatData(ranks);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.ranks || _.isEmpty(nextProps.ranks)) { return; }
    this.formatData(nextProps.ranks);
  }

  // from https://ecommerce.shopify.com/c/ecommerce-design/t/ordinal-number-in-javascript-1st-2nd-3rd-4th-29259
  getOrdinal(rank) {
    const position = get(rank, 'position');
    if (!position) { return 'N/A'; }
    const s = ["th","st","nd","rd"]
    const v = position % 100;
    return position+(s[(v-20)%10]||s[v]||s[0]);
  }

  formatData(ranks) {
    const myRanks = _.filter(ranks, r => r.id.includes(this.props.session.user));
    const [weekly, allTime] = _.partition(myRanks, r => r.period === 'weekly');
    const [earthWeekly, schoolWeekly] = _.partition(weekly, r => r.group === 'Earth');
    const [earthAllTime, schoolAllTime] = _.partition(allTime, r => r.group === 'Earth');
    
    this.setState({
      ranks: {
        earthWeekly: this.getOrdinal(earthWeekly[0]),
        earthAllTime: this.getOrdinal(earthAllTime[0]),
        schoolWeekly: this.getOrdinal(schoolWeekly[0]),
        schoolAllTime: this.getOrdinal(schoolAllTime[0])
      }
    });
  }

  render() {
    const ranks = this.state.ranks;

    return (
      <SidebarContainer>
        <Header>
          Leaderboards
        </Header>
        {ranks &&
          <ul style={{listStyle:'none',margin:'0 auto',width:'60%',padding:'0'}}>
            {_.map(STATS,  data => {
              return <LeaderboardListItem key={data.slug}>
                <Icon src={data.image} />
                <StatName>
                  {data.name}
                </StatName>
                <Stat color={data.color} forLeaderboards={true}>
                  {ranks[data.slug]}
                </Stat>
              </LeaderboardListItem>
            })}
          </ul>
        }
      </SidebarContainer>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  ranks: _.values(state.entities.ranks),
  user: _.first(_.values(state.entities.user))
})

export default connect(mapStateToProps)(MiniLeaderboard)
