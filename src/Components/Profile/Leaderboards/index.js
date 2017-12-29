import { connect } from 'react-redux'
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
      this.setState({ loading: true }, () => this.props.dispatch(loadLeaderboards(schoolId)));
    }
  }

  render() {
    const leaderboards = this.props.leaderboards;
    const { location, period } = this.state;

    const leaderboard = (() => {
      if (_.has(leaderboards, location) && leaderboards[location][period[0]]) {
        return leaderboards[location][period[0]].map((user, i) => {
          return <Row key={i} even={i % 2 === 0}>
            <td style={{width:'25%'}}>
              <Rank>
                {i + 1}
              </Rank>
            </td>
            <td style={{width:'50%',textAlign:'left'}}>
              <h3>
                {user.name}
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
        <p style={{fontSize:'3em',lineHeight:'0px'}}>Leaderboards</p>
        <div>
          <Dropdown
            choices={PERIOD_CHOICES.map((c) => c[1])} 
            handleSelect={(period) => this.setState({ period: _.find(PERIOD_CHOICES, (p) => p[1] === period) })}
            selected={this.state.period[1]} />
          <Dropdown 
            choices={_.keys(this.props.leaderboards)} 
            handleSelect={(location) => this.setState({ location })}
            selected={this.state.location} />

          <Table>  
            <tbody>
              {leaderboard}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

const Table = styled.table`
  border-collapse: separate;
  border-spacing: 0 1em;
  border: 5px solid ${color.lightestGray};
  border-radius: 5px;
  font-size: 1.25em;
  margin: 0 auto;
  margin-top: 20px;
  padding: 5px 20px 5px 20px;
  width: 80%;
`

const Row = styled.tr`
  background-color: ${props => props.even ? color.lightestGray : 'white'};
  height: 70px;
  border-radius: 20px;
`

const Rank = styled.h3`
  background-color: ${color.blue};
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
