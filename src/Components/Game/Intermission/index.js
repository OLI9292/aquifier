import _ from 'underscore';
import { connect } from 'react-redux'
import React, { Component } from 'react';
import CircularProgressbar from 'react-circular-progressbar';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import 'react-circular-progressbar/dist/styles.css';
import styled from 'styled-components';
import get from 'lodash/get';

import { shouldRedirect } from '../../../Library/helpers';
import { color, media } from '../../../Library/Styles/index';
import yellowStar from '../../../Library/Images/icon-star-yellow.png';
import grayStar from '../../../Library/Images/icon-star-gray.png';
import exitPng from '../../../Library/Images/exit-gray.png';

import { fetchLeaderboardsAction } from '../../../Actions/index';

import {
  ExitImg,
  Container,
  LevelProgressContainer,
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
      rankUpdates: {}
    }
  }

  componentDidMount() {
    this.loadLeaderboard(this.props);
    const [p1, p2] = get(this.props.level, "progress") || [0,1];
    const progress = { p1: p1, p2: p2, percentage: 100 * p1 / p2, text: p1 + "/" + p2 };
    this.setState({ progress });
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

  loadLeaderboard(props) {
    const userId = get(props.user, "_id");
    const classId = get(_.first(get(props.user, "classes")), "id");
    if (!userId || !props.session || this.state.loadedLeaderboard) { return; }
    this.setState({ loadedLeaderboard: true, isInClass: _.isString(classId) });
    let query = `userId=${userId}&onlyUser=true`;
    if (classId) { query += `&classId=${classId}`; }
    this.props.dispatch(fetchLeaderboardsAction(query, props.session));    
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
      progress
    } = this.state;

    const row = stat => <tr key={stat.word} style={{display:"flex",alignItems:"center"}}>
      <WordCell>
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
        <TableHeader>
          {`${filtered.length} Word${filtered.length === 1 ? "" : "s"} ${name}`}
        </TableHeader>
        <Table>
          <tbody>
            {_.map(filtered, row)}
          </tbody>
        </Table>
      </div>  
    })));

    const span = (_color, text) => <span style={{color:_color,fontSize:"1.1em"}}>{text}</span>;    

    const rankText = (update, color) => <p>
      {`You ${update.direction}  `}
      {span(color, update.difference)}  spots to  {span(color, `#${update.newRank}`)}
    </p>;

    return (
      <Container>
        <Link style={{position:"absolute",left:"10px",top:"10px"}} to={'/home'}>
          <ExitImg src={exitPng} />
        </Link>

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

        <TablesContainer>
          {tables}
        </TablesContainer>

        <Button
          onClick={this.nextRound.bind(this)}>
          next round
        </Button>
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
