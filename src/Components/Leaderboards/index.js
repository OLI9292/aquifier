import { connect } from 'react-redux'
import moment from 'moment';
import React, { Component } from 'react';
import _ from 'underscore';
import queryString from 'query-string';
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
      classRanks: [],
      worldRanks: [],
      isWeekly: true,
      isClass: true
    }
  }

  componentDidMount() {
    //this.loadClassLeaderboard(this.props);
  }

  componentWillReceiveProps(nextProps) {
    //this.loadClassLeaderboard(nextProps);
  }

  loadClassLeaderboard = async props => {
    const classId = get(_.first(get(props.user, "classes")), "id");
    if (!classId || !props.session || this.state.loadingClassLeadeboards) { return; }
    this.setState({ loadingClassLeadeboards: true });
    const query = `classId=${classId}`;
    const result = await this.props.dispatch(fetchLeaderboardsAction(query, props.session));
    if (result.error) { return; }
    this.setState({ classRanks: result.response.entities || [] });
    this.loadWorldLeaderboard();
  }

  loadWorldLeaderboard = async (ranks, isWeekly, direction) => {
    const { session } = this.props;
    let query;

    if (ranks === undefined) {
      const userId = session.isTeacher
        ? get(_.find(this.state.classRanks, rank => !rank.isWeekly && rank.position === 1), "userId")
        : session.user;
      query = `userId=${userId}`;
    } else {
      const position = direction === "prev"
        ? Math.max(get(ranks[0], "position") - 20, 1)
        : get(_.last(ranks), "position");
      query = `position=${position}`;
      if (isWeekly) { query += "&isWeekly=true"; }
    }
    
    this.setState({ loadingMore: true });
    const result = await this.props.dispatch(fetchLeaderboardsAction(query, session));
    this.setState({ loadingMore: false });
    if (result.error) { return; }
    this.setState({ worldRanks: result.response.entities || [] });
  }

  render() {
    const {
      classRanks,
      worldRanks,
      isWeekly,
      isClass,
      loadingMore
    } = this.state;

    const ranks = _.filter((isClass ? classRanks : worldRanks), r => isWeekly ? r.isWeekly : !r.isWeekly);

    const initials = name => name.split(" ")[0].charAt(0) + (name.split(" ")[1] ? name.split(" ")[1].charAt(0) : "");

    const highlight = userId => get(this.props.session, "isTeacher")
      ? !isClass && _.pluck(classRanks, "userId").includes(userId)
      : (get(this.props.session, "user") === userId);

    const row = (rank, idx) => <Row key={idx} even={idx % 2 === 0}>
      <td style={{width:'25%'}}>
        <Rank isUser={highlight(rank.userId)}>
          {rank.position}
        </Rank>
      </td>
      <td style={{textAlign:'left',fontFamily:'BrandonGrotesque',color:color.gray2}}>
        <h3>
          {isClass ? rank.name : initials(rank.name)}
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

    const rows = _.map(ranks, (rank, idx) => row(rank, idx));

    const loadMore = (direction) => {
      const hide = direction === 'prev'
        ? _.contains(_.pluck(ranks, 'position'), 1)
        : _.contains(_.pluck(ranks, 'isLast'), true);
      return !_.isEmpty(ranks) && <LoadMoreButton 
        onClick={() => this.loadWorldLeaderboard(ranks, isWeekly, direction)}
        loadingMore={loadingMore}
        hide={hide}>
        load more
      </LoadMoreButton>;      
    };

    const disclaimer = <p style={{margin:"40px 0px"}}>
      {`Score points to appear on the ${isWeekly ? "weekly " : ""}leaderboard.`}
    </p>;

    return (
      <Container loading={this.state.loading}>
        <Header.medium>
          leaderboards
        </Header.medium>

        <DropdownContainer>
          <Dropdown 
            choices={["My Class","Earth"]} 
            handleSelect={group => this.setState({ isClass: group === "My Class" }, this.loadWorldLeaderboard)}
            selected={isClass ? "My Class" : "Earth"} />
          <Dropdown
            choices={["Weekly","All Time"]} 
            handleSelect={period => this.setState({ isWeekly: period === "Weekly" }, this.loadWorldLeaderboard)}
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
              {rows.length ? rows : disclaimer}
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
  ranks: _.values(state.entities.ranks)
})

export default connect(mapStateToProps)(Leaderboards)
