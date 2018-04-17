import { connect } from 'react-redux'
import moment from 'moment';
import React, { Component } from 'react';
import _ from 'underscore';
import { color } from '../../Library/Styles/index';
import get from "lodash/get";

import Dropdown from '../Common/dropdown';
import { fetchLeaderboardsAction } from '../../Actions/index';
import star from '../../Library/Images/star-yellow.png';
import { Container } from '../Common/container';
import Header from '../Common/header';

import {
  DropdownContainer,
  LoadMoreButton,
  Rank,
  Row,
  Table,
  TableContainer
} from './components'

class Leaderboards extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isWeekly: true,
      isClass: true
    }
  }

  componentDidMount() {
    this.loadInitialLeaderboard(this.props.user);
  }

  componentWillReceiveProps(nextProps) {
    this.loadInitialLeaderboard(nextProps.user);
  }

  loadInitialLeaderboard(user) {
    const userId = get(user, "_id");
    const classId = get(_.first(get(user, "classes")), "id");
    if (!userId || !classId || this.state.loadedLeaderboard) { return; }
    const isTeacher = user.isTeacher === true;
    this.setState({ loadedLeaderboard: true });
    const query = isTeacher ? `classId=${classId}` : `userId=${userId}&classId=${classId}`;
    this.loadLeaderboard(query);
  }

  loadLeaderboard(query) {
    this.props.dispatch(fetchLeaderboardsAction(query, this.props.session));
  }

  loadMore(ranks, isWeekly, direction) {
    const position = direction === "prev"
      ? Math.max((get(_.first(ranks), "rank") || 20) - 20, 1)
      : get(_.last(ranks), "rank");
    const query = isWeekly ? `position=${position}&isWeekly=true` : `position=${position}`;
    this.loadLeaderboard(query);
  }

  highlight(userId) {
    const studentIds = this.props.isTeacher && _.pluck(get(this.props.ranks, "weeklyClass"), "userId");
    return this.props.isTeacher
      ? !this.state.isClass && studentIds.includes(userId)
      : (get(this.props.session, "user") === userId);
  }

  initials(f, l) {
    return (l ? `${f.charAt(0)}${l.charAt(0)}` : f.charAt(0)).toUpperCase();
  }

  render() {
    const {
      isWeekly,
      isClass,
      loadingMore
    } = this.state;

    const {
      ranks
    } = this.props;

    const selectedRanks = (() => {
      switch(`${isWeekly}-${isClass}`) {
        case 'true-true':  return get(ranks, "weeklyClass")
        case 'true-false': return get(ranks, "weeklyEarth")
        case 'false-true': return get(ranks, "allTimeClass")
        default:           return get(ranks, "allTimeEarth")
      }  
    })();

    const row = (rank, idx) => <Row key={idx} even={idx % 2 === 0}>
      <td style={{width:'25%'}}>
        <Rank isUser={this.highlight(rank.userId)}>
          {rank.rank}
        </Rank>
      </td>
      <td style={{textAlign:'left',fontFamily:'BrandonGrotesque',color:color.gray2}}>
        <h3>
          {isClass ? `${rank.firstName} ${rank.lastName}` : this.initials(rank.firstName, rank.lastName)}
        </h3>
      </td>
      <td style={{textAlign:'left',fontFamily:'BrandonGrotesque',color:color.gray2}}>
        <h4>
          {!isClass && rank.school}
        </h4>
      </td>      
      <td style={{display:'flex',alignItems:'center',justifyContent:'center',height:'70px'}}>
        <p style={{fontSize:'1.1em',color:color.gray2}}>
          {rank.points}
        </p>
        <img 
          alt="star"
          style={{height:'25px',margin:'0px 0px 4px 7px'}} 
          src={star} />
      </td>
    </Row>;

    const loadMore = direction => {
      const hide = isClass || (direction === "prev"
        ? _.contains(_.pluck(selectedRanks, 'rank'), 1)
        : get(selectedRanks, "length") < 20);

      return !_.isEmpty(selectedRanks) && <LoadMoreButton 
        onClick={() => this.loadMore(selectedRanks, isWeekly, direction)}
        loadingMore={loadingMore}
        hide={hide}>
        load more
      </LoadMoreButton>;   
    }   

    const disclaimer = <tr style={{margin:"40px 0px"}}>
      <td>
        {`Score points to appear on the ${isWeekly ? "weekly " : ""}leaderboard.`}
      </td>
    </tr>;

    return (
      <Container>
        <Header.medium>
          leaderboards
        </Header.medium>

        <DropdownContainer>
          <Dropdown 
            choices={["My Class","Earth"]} 
            handleSelect={group => this.setState({ isClass: group === "My Class" })}
            selected={isClass ? "My Class" : "Earth"} />
          <Dropdown
            choices={["Weekly","All Time"]} 
            handleSelect={period => this.setState({ isWeekly: period === "Weekly" })}
            selected={isWeekly ? "Weekly" : "All Time"} />
        </DropdownContainer>

        <TableContainer>
          <Header.small style={{paddingTop:'20px'}}>
            {isClass ? "my class" : "earth"}
          </Header.small>

          <p style={{color:color.mediumLGray,fontSize:'0.8em'}}>
            {isWeekly
              ? moment().startOf('week').format('MMM Do YY') +
                ' to ' +
                moment().endOf('week').format('MMM Do YY')
              : "All Time"}
          </p>

          {loadMore('prev')}
          
          <Table>  
            <tbody>
              {!_.isEmpty(selectedRanks) ? _.map(selectedRanks, (rank, idx) => row(rank, idx)) : disclaimer}
            </tbody>
          </Table>        

          {loadMore('next')}      
        </TableContainer>
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  session: state.entities.session,
  user: _.first(_.values(state.entities.user)),
  ranks: state.entities.ranks,
  isTeacher: get(state.entities.session, "isTeacher") === true
});

export default connect(mapStateToProps)(Leaderboards);
