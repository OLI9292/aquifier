import _ from 'underscore';
import { connect } from 'react-redux'
import React, { Component } from 'react';
import CircularProgressbar from 'react-circular-progressbar';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import 'react-circular-progressbar/dist/styles.css';
import styled from 'styled-components';
import get from 'lodash/get';

import Header from '../../Header/index';
import { shouldRedirect } from '../../../Library/helpers';
import { color, media } from '../../../Library/Styles/index';
import yellowStar from '../../../Library/Images/icon-star-yellow.png';
import grayStar from '../../../Library/Images/icon-star-gray.png';
import exitPng from '../../../Library/Images/exit-gray.png';

import { fetchLeaderboardsAction } from '../../../Actions/index';

import {
  Container,
  BattleStatusHeader,
  LevelProgressContainer,
  NavigationContainer,
  LeaderboardProgressContainer,
  CTA,
  TopContainer,
  StarImage,
  Button,
  CircularProgressbarContainer,
  LevelProgressHeader,
  LeaderboardText,
  TablesContainer,
  TableHeader,
  Table,
  UserUpdateContainer,
  WordCell
} from './components';

const TABLE_FILTERS = {
  Discovered: stat => stat.level === 1,
  Improved: stat => stat.level > 1 && stat.level < 9,
  Mastered: stat => stat.level === 9,
};

class Intermission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rankUpdates: {}
    }
  }

  componentDidMount() {
    const {
      level,
      battleResults
    } = this.props;

    this.loadLeaderboard();

    if (battleResults) {
      this.setState({ isBattle: true });
    } else {
      const [p1, p2] = get(level, "progress") || [0,1];
      const progress = { p1: p1, p2: p2, percentage: 100 * p1 / p2, text: p1 + "/" + p2 };
      this.setState({ progress });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      !this.props.userRanks ||
      !nextProps.userRanks ||
      _.isEqual(this.props.userRanks, nextProps.userRanks)
    ) { return; }

    const {
      allTimeEarth,
      allTimeClass 
    } = this.props.userRanks;
    
    const [newAllTimeEarth, newAllTimeClass] = [
      get(nextProps.userRanks, "allTimeEarth"),
      get(nextProps.userRanks, "allTimeClass")
    ];
    
    const rankUpdates = {
      earth: this.rankDiff(allTimeEarth, newAllTimeEarth),
      class: this.rankDiff(allTimeClass, newAllTimeClass)
    };

    this.setState({ rankUpdates });
  }

  rankDiff(oldRank, newRank) {
    if (!Number.isInteger(oldRank) || !Number.isInteger(newRank)) { return; }
    const difference = oldRank - newRank;
    const direction = difference < 0 ? "fell" : "climbed";
    return { difference: difference, direction: direction, newRank: newRank };
  }

  loadLeaderboard() {
    const userId = get(this.props.user, "_id");
    const classId = get(_.first(get(this.props.user, "classes")), "id");
    if (!userId || this.state.loadedLeaderboard) { return; }
    this.setState({ loadedLeaderboard: true, isInClass: _.isString(classId) });
    let query = `userId=${userId}&onlyUser=true`;
    if (classId) { query += `&classId=${classId}`; }
    this.props.dispatch(fetchLeaderboardsAction(query, this.props.session));    
  }

  nextRound() {
    const { level, levels } = this.props;
    const { p1, p2 } = this.state.progress;

    let redirect, query

    if (p1 < p2) {
      redirect = window.location.pathname.replace(`stage=${p1}`,`stage=${p1+1}`);
      query = redirect.replace('/play/','')
    } else {
      const nextLevel = _.find(levels, l => l.type === 'train' && l.ladder === (level.ladder + 1));
      query = nextLevel && `id=${nextLevel._id}&stage=1&type=train`;
      redirect = nextLevel ? `/play/${query}` : '/home';
    }

    this.setState({ redirect }, () => { if (query) { this.props.loadAllData(query); } });
  }

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }  

    const {
      rankUpdates,
      page,
      progress,
      isBattle
    } = this.state;

    const {
      battleResults
    } = this.props;

    const row = stat => <tr key={stat.word} style={{display:"flex",alignItems:"center"}}>
      <WordCell userWon={battleResults.userWon}>
        {stat.word}
      </WordCell>    
      <td>
        {_.map(_.range(1,11), n => <StarImage
          alt={'star icon'}
          key={n}
          src={n <= stat.level ? yellowStar : grayStar} />
        )}
      </td>
    </tr>;

    const tables = _.compact(_.values(_.mapObject(TABLE_FILTERS, (filter, name) => {
      const filtered = _.sortBy(_.filter(this.props.stats, filter), stat => stat.word);
      return filtered.length && <div key={name}>
        <TableHeader userWon={battleResults.userWon}>
          {`${filtered.length} Word${filtered.length === 1 ? "" : "s"} ${name}`}
        </TableHeader>
        <Table>
          <tbody>
            {_.map(filtered, row)}
          </tbody>
        </Table>
      </div>  
    })));

    const span = (_color, text, bold = false) => <span 
      style={{color:_color,fontFamily:bold ? "BrandonGrotesqueBold" : "BrandonGrotesque"}}>
      {text}
    </span>;    

    const rankText = (update, color) => <p>
      {`You ${update.direction}  `}
      {span(color, update.difference)}  spots to  {span(color, `#${update.newRank}`)}
    </p>;

    const userUpdates = () => {
      const eloDiff = `(${battleResults.userWon ? "+" : ""}${battleResults.newUserElo - battleResults.userElo})`;
      
      const [textColor1, textColor2, backgroundColor, textColor3] = battleResults.userWon
        ? ["white", "#3F81E6", "white", "#3F81E6"]
        : ["black", "white", "#3DB1FE", "white"];

      return <UserUpdateContainer>
        <p style={{color:textColor1}}>Your new rating is</p>
        <p style={{margin:"0px 10px",backgroundColor:backgroundColor,padding:"3px 12px",borderRadius:"20px"}}>
          {span(textColor2, battleResults.newUserElo, true)} {span(textColor3, eloDiff)}
        </p>
      </UserUpdateContainer>;
    }

    const battleComponents = () => <div>
      <BattleStatusHeader userWon={battleResults.userWon}>
        {`you ${battleResults.userWon ? "win!" : "lose"}`}
      </BattleStatusHeader>
      {page === 0 ? userUpdates() : <TablesContainer>{tables}</TablesContainer>}
    </div>;

    const navigation = () => {
      const [page1color, page2color] = battleResults.userWon
        ? (page === 0 ? ["white", "#A5D8FF"] : ["#A5D8FF", "white"])
        : (page === 0 ? ["#3F81E6", "#A5D8FF"] : ["#A5D8FF", "#3F81E6"]);

      return <NavigationContainer>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"150px"}}>
          <div style={{width:"50%",height:"100%",display:"flex",alignItems:"center",justifyContent:"flex-end"}}
            onClick={() => this.setState({ page: 0 })}>
            <div
              style={{height:"15px",width:"15px",backgroundColor:page1color,borderRadius:"50%",marginRight:"8px"}} />
          </div>
          <div style={{width:"50%",height:"100%",display:"flex",alignItems:"center"}}
            onClick={() => this.setState({ page: 1 })}>
            <div
              style={{height:"15px",width:"15px",backgroundColor:page2color,borderRadius:"50%",marginLeft:"8px"}} />
          </div>
        </div>    
        <Button
          userWon={battleResults.userWon}
          onClick={() => this.setState({ redirect: "/home?searchImmediately=true"})/*this.nextRound.bind(this)*/}>
          new game
        </Button>      
      </NavigationContainer>;
    }

    return (
      <Container userWon={battleResults.userWon}>        
        {isBattle && battleComponents()}
        {navigation()}
        <div style={{position:"absolute",left:"0"}}>
          <Header />
        </div>
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  userRanks: state.entities.userRanks,
  user: _.first(_.values(state.entities.user)),
  session: state.entities.session  
});

export default connect(mapStateToProps)(Intermission);
/*
<TopContainer>
  <LevelProgressContainer>
    <CircularProgressbarContainer>
      <CircularProgressbar
        strokeWidth={10}
        styles={{path: { stroke: color.green }}}
        percentage={get(progress, "percentage")}
        textForPercentage={() => get(progress, "text")}
        classForPercentage={() => "circularProgressbarPercentage"} />
    </CircularProgressbarContainer>
    <LevelProgressHeader>
      round complete!
    </LevelProgressHeader>
  </LevelProgressContainer>

  {(rankUpdates.class || rankUpdates.earth) && <LeaderboardProgressContainer>
    {rankUpdates.class && <LeaderboardText>
      <img
        style={{height:"35px",width:"35px",marginRight:"10px"}}
        src={require("../../../Library/Images/icon-house.png")} />
      {rankText(rankUpdates.class, color.red)}
    </LeaderboardText>}

    {rankUpdates.earth && <LeaderboardText>
      <img
        style={{height:"35px",width:"35px",marginRight:"10px"}}
        src={require("../../../Library/Images/icon-earth.png")} />
      {rankText(rankUpdates.earth, color.blue)}
    </LeaderboardText>}

    <CTA>
      Ready to compete internationally and win prizes? <Link
        to={'/championships'}
        style={{color:color.warmYellow,textDecoration:"underline",cursor:"pointer"}}>
        Click here
      </Link> 
    </CTA>
  </LeaderboardProgressContainer>}
</TopContainer>
*/