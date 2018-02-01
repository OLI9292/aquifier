import { connect } from 'react-redux'
import moment from 'moment';
import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';
import Button from '../../Common/button';
import queryString from 'query-string';

import { color, media } from '../../../Library/Styles/index';
import Dropdown from '../../Common/dropdown';
import { loadLeaderboards } from '../../../Actions/index';

const PERIOD_CHOICES = [
  ['weekly', 'Weekly'],
  ['all', 'All Time']
]

class Leaderboards extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
    if (props.ranks.length) {
      if (props.ranks.length !== this.props.ranks.length) {
        this.setState({ loadingMore: false, loading: false });
      }
      if (!this.state.location) {
        this.setState({ location: _.first(_.pluck(props.ranks, 'group')) });
      }      
    } else if (props.user && !this.state.loading) {
      const params = props.user.isTeacher ? { school: props.user.school } : { user: props.user._id };
      const query = queryString.stringify(params);      
      this.setState({ loading: true }, () => this.props.dispatch(loadLeaderboards(query, this.props.session)));
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
    return this.props.ranks.filter(r => r.group === this.state.location && r.period === this.state.period[0])
  }

  loadMore(direction) {
    this.setState({ loadingMore: true });
    
    const positions = _.pluck(_.sortBy(this.leaderboard(), 'position'), 'position')
    const position = direction === 'prev' ? (Math.max(positions[0], 0) - 20) : _.last(positions)
    const rank = _.find(this.props.ranks, (r) => r.group === this.state.location);
    const location = rank.schoolId || 'Earth';
    const query = queryString.stringify({ period: this.state.period[0], school: location, start: position });

    this.props.dispatch(loadLeaderboards(query, this.props.session));
  }

  render() {
    const leaderboard = () => {
      return _.sortBy(this.leaderboard(), 'position').map((user, i) => {
        const content = this.state.location === 'Earth' && user.schoolName
          ? `${user.name}, ${user.schoolName}`
          : user.name;
        return <Row key={i} even={i % 2 === 0}>
          <td style={{width:'25%'}}>
            <Rank isUser={this.props.user._id === user._id}>
              {user.position}
            </Rank>
          </td>
          <td style={{width:'50%',textAlign:'left'}}>
            <h3>
              {content}
            </h3>
          </td>
          <td style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
            <p style={{fontSize:'1.1em'}}>{user.score}</p>
            <img 
              alt="star"
              style={{height:'25px',margin:'0px 0px 4px 5px'}} 
              src={require('../../../Library/Images/star-yellow.png')} />
          </td>
        </Row>
      })
    };

    const loadMore = (direction) => {
      const hide = direction === 'prev'
        ? _.contains(_.pluck(this.leaderboard(), 'position'), 1)
        : _.contains(_.pluck(this.leaderboard(), 'isLast'), true);

      return <LoadMoreButton 
        onClick={() => this.loadMore(direction)}
        loadingMore={this.state.loadingMore}
        hide={hide}>
        Load More
      </LoadMoreButton>;      
    };

    return (
      <Container loading={this.state.loading}>
        <h1 style={{letterSpacing:'1px'}}>
          Leaderboards
        </h1>

        <DropdownContainer>
          <Dropdown 
            choices={_.unique(_.pluck(this.props.ranks, 'group'))} 
            handleSelect={(location) => this.setState({ location })}
            selected={this.state.location} />
          <Dropdown
            choices={PERIOD_CHOICES.map((c) => c[1])} 
            handleSelect={(period) => this.setState({ period: _.find(PERIOD_CHOICES, (p) => p[1] === period) })}
            selected={this.state.period[1]} />
        </DropdownContainer>

        <TableContainer>
          <p style={{lineHeight:'0px',paddingTop:'20px',fontSize:'1.5em'}}>
            <b>{this.state.location}</b>
          </p>
          <p>
            {this.periodTitle()}
          </p>
          {loadMore('prev')}
          <table style={{padding:'5px 20px 20px 20px',width:'100%',margin:'0 auto',borderCollapse:'separate',borderSpacing:'0'}}>  
            <tbody>
              {leaderboard()}
            </tbody>
          </table>        
          {loadMore('next')}      
        </TableContainer>
      </Container>
    );
  }
}

const Container = styled.div`
  pointer-events: ${props => props.loading ? 'none' : 'auto'};
  padding: 50px;
  text-align: center;
  position: relative;
  ${media.phone`
    padding: 25px;
  `};    
`

const DropdownContainer = styled.div`
  display: flex;
  width: 300px;
  margin: 0 auto;
  justify-content: space-between;
  left: 50%;
  transform: translateX(-50%);
  position: absolute;
  top: 150px;
  ${media.phone`
    top: 110px;
    width: 275px;
  `};   
`

const LoadMoreButton = Button.small.extend`
  display: ${props => props.hide ? 'none' : 'inline-block'};
  margin: 0 auto;
  margin-top: 10px;
  margin-bottom: 20px;
  background-color: ${props => props.loadingMore ? color.green : color.blue};
`

const TableContainer = styled.div`
  border-collapse: separate;
  border-spacing: 0 1em;
  border: 5px solid ${color.lightestGray};
  border-radius: 5px;
  font-size: 1.25em;
  margin: 0 auto;
  margin-top: 120px;
  width: 100%;
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
  session: state.entities.session,
  user: _.first(_.values(state.entities.user)),
  ranks: _.values(state.entities.ranks),
})

export default connect(mapStateToProps)(Leaderboards)
