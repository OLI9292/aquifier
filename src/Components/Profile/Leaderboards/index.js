import { connect } from 'react-redux'
import moment from 'moment';
import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';
import queryString from 'query-string';

import { color } from '../../../Library/Styles/index';
import Dropdown from '../../Common/dropdown';
import { loadLeaderboards } from '../../../Actions/index';

const LOCATION = 'Earth'
const PERIOD_CHOICES = [
  ['weekly', 'Weekly'],
  ['all', 'All Time']
]

class Leaderboards extends Component {
  constructor(props) {
    super(props);

    this.state = {
      location: LOCATION,
      period: PERIOD_CHOICES[0]
    }
  }

  componentDidMount() {
    this.loadData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.loadData(nextProps);
  }

  loadData(props) {
    if (props.user && !this.state.loading) {
      const query = queryString.stringify({ user: props.user._id });
      this.setState({ loading: true }, () => this.props.dispatch(loadLeaderboards(query)));
    } else if (!_.isEqual(props.ranks, this.props.ranks)) {
      this.setState({ loadingMore: false });
    }
  }

  periodTitle() {
    if (this.state.period === PERIOD_CHOICES[1]) {
      return PERIOD_CHOICES[1][1];
    } else {
      return moment().startOf('week').format('MMM Do YY') + ' to ' +
             moment().endOf('week').format('MMM Do YY');
    }
  }

  leaderboard() {
    return this.props.ranks.filter(r => r.schoolName === this.state.location && r.period === this.state.period[0])
  }

  loadMore(direction) {
    this.setState({ loadingMore: true });
    
    const positions = _.pluck(_.sortBy(this.leaderboard(), 'position'), 'position')
    const position = direction === 'prev' ? (Math.max(positions[0], 0) - 20) : _.last(positions)
    const rank = _.find(this.props.ranks, (r) => r.schoolName === this.state.location);
    const school = rank && rank.school;
    const query = queryString.stringify({ period: this.state.period[0], school: school, start: position });

    this.props.dispatch(loadLeaderboards(query));
  }

  render() {
    const leaderboard = (() => {
      return _.sortBy(this.leaderboard(), 'position').map((user, i) => {
        return <Row key={i} even={i % 2 === 0}>
          <td style={{width:'25%'}}>
            <Rank isUser={this.props.user._id === user._id}>
              {user.position}
            </Rank>
          </td>
          <td style={{width:'50%',textAlign:'left'}}>
            <h3>
              {this.state.location === 'Earth' ? `${user.name}, ${user.schoolName}` : user.name}
            </h3>
          </td>
          <td style={{width:'25%',textAlign:'center',fontSize:'1.1em'}}>
            {user.score}
          </td>
        </Row>
      })
    })();

    return (
      <div style={{paddingTop:'25px',margin:'0 auto',width:'95%',textAlign:'center'}}>
        <div style={{width:'80%',margin:'0 auto',textAlign:'left'}}>
          <p onClick={() => this.loadMore()} style={{fontSize:'3em',lineHeight:'0px',display:'inline-block'}}>
            Leaderboards
          </p>
          <div style={{display:'inline-block',textAlign:'center',verticalAlign:'top',margin:'20px 0px 0px 30px'}}>
            <Dropdown 
              choices={_.unique(_.pluck(this.props.ranks, 'schoolName'))} 
              handleSelect={(location) => this.setState({ location })}
              selected={this.state.location} />
            <Dropdown
              choices={PERIOD_CHOICES.map((c) => c[1])} 
              handleSelect={(period) => this.setState({ period: _.find(PERIOD_CHOICES, (p) => p[1] === period) })}
              selected={this.state.period[1]} />
          </div>
        </div>
        
        <p style={{color:color.gray,textAlign:'left',marginLeft:'10%',marginTop:'-15px'}}>
          Tracked by count of stars
        </p>

        <TableContainer>
          <p style={{lineHeight:'0px',paddingTop:'20px',fontSize:'1.5em'}}><b>{this.state.location}</b></p>
          <p>{this.periodTitle()}</p>

          <LoadMoreContainer hide={_.contains(_.pluck(this.leaderboard(), 'position'), 1)}>
            <Circle 
              loadingMore={this.state.loadingMore}
              onMouseOver={() => this.loadMore('prev')} />
            <div>
              <p>Load More</p>
            </div>
          </LoadMoreContainer>

          <table style={{padding:'5px 20px 5px 20px',width:'100%',margin:'0 auto',borderCollapse:'separate',borderSpacing:'0'}}>  
            <tbody>
              {leaderboard}
            </tbody>
          </table>        
        </TableContainer>
      </div>
    );
  }
}

const Circle = styled.div`
  transition: all 0.2s ease-in-out;
  background: ${props => props.loadingMore ? color.green : 'white'};
  cursor: pointer;
  border: 2px solid ${color.lightGray};
  border-radius: 100%;
  overflow: hidden;  
  width: 20px;
  height: 20px;  
  margin: 0px 7px 2px 0px;
`

const LoadMoreContainer = styled.div`
  visibility: ${props => props.hide ? 'hidden' : 'visibile'};
  display: flex;
  align-items: center;
  width: 75%;
  margin: 0 auto;
`

const TableContainer = styled.div`
  border-collapse: separate;
  border-spacing: 0 1em;
  border: 5px solid ${color.lightestGray};
  border-radius: 5px;
  font-size: 1.25em;
  margin: 0 auto;
  margin-top: 20px;
  width: 80%;
`

const Row = styled.tr`
  background-color: ${props => props.even ? color.lightestGray : 'white'};
  height: 70px;
  border-radius: 20px;
`

const Rank = styled.h3`
  background-color: ${props => props.isUser ? color.green : color.blue};
  border-radius: 5px;
  color: white;
  height: 50px;
  line-height: 50px;
  margin: 0 auto;
  width: 50px;
`

const mapStateToProps = (state, ownProps) => ({
  user: _.first(_.values(state.entities.user)),
  ranks: _.values(state.entities.ranks)
})

export default connect(mapStateToProps)(Leaderboards)
