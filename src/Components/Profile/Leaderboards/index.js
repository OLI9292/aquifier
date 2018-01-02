import { connect } from 'react-redux'
import moment from 'moment';
import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';

import { color } from '../../../Library/Styles/index';
import Dropdown from '../../Common/dropdown';
import { loadLeaderboards } from '../../../Actions/index';

const LOCATION = 'Earth'
const PERIOD_CHOICES = [
  ['weekly', 'Weekly'],
  ['allTime', 'All Time']
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
    if (props.user && props.user.school && !this.state.loading) {
      const schoolId = props.user.school;
      this.setState({ loading: true }, () => this.props.dispatch(loadLeaderboards(schoolId, props.user._id)));
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

  loadMore() {
    console.log('load more')
    //this.props.dispatch(loadLeaderboards(schoolId, props.user._id,)));
  }

  render() {
    const { leaderboards } = this.props;
    const { location, period } = this.state;

    const leaderboard = (() => {
      if (_.has(leaderboards, location) && leaderboards[location][period[0]]) {
        return leaderboards[location][period[0]].map((user, i) => {
          return <Row key={i} even={i % 2 === 0}>
            <td style={{width:'25%'}}>
              <Rank isUser={this.props.user._id === user._id}>
                {user.position}
              </Rank>
            </td>
            <td style={{width:'50%',textAlign:'left'}}>
              <h3>
                {this.state.location === 'Earth' ? `${user.name}, ${user.school}` : user.name}
              </h3>
            </td>
            <td style={{width:'25%',textAlign:'center',fontSize:'1.1em'}}>
              {user.score}
            </td>
          </Row>
        })
      }
    })();

    return (
      <div style={{paddingTop:'25px',margin:'0 auto',width:'95%',textAlign:'center'}}>
        <div style={{width:'80%',margin:'0 auto',textAlign:'left'}}>
          <p onClick={() => this.loadMore()} style={{fontSize:'3em',lineHeight:'0px',display:'inline-block'}}>
            Leaderboards
          </p>
          <div style={{display:'inline-block',textAlign:'center',verticalAlign:'top',margin:'20px 0px 0px 30px'}}>
            <Dropdown 
              choices={_.keys(this.props.leaderboards)} 
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
  leaderboards: state.entities.leaderboards
})

export default connect(mapStateToProps)(Leaderboards)
