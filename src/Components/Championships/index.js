import { Redirect } from 'react-router';
import moment from 'moment';
import _ from 'underscore';
import { connect } from 'react-redux'
import React, { Component } from 'react';
import get from "lodash/get";

import { shouldRedirect, initials } from '../../Library/helpers'
import { Container } from '../Common/container';
import star from '../../Library/Images/star-yellow.png';
import Header from '../Common/header';
import { ModalContainer } from '../Common/modalContainer';
import { DarkBackground } from '../Common/darkBackground';
import { color } from '../../Library/Styles/index';

import {
  fetchCompetitionAction
} from '../../Actions/index';

import {
  TextContainer
} from './components';

import {
  TableContainer,
  Table,
  Row,
  Rank,
  Star
} from '../Leaderboards/components';

const START_DATE = "2018-5-1";
const TIME_UNTIL_START = moment().to(START_DATE).replace("in ","");

class Championships extends Component {
  constructor(props) {
    super(props);
    this.state = {};   
  }

  async componentDidMount() {
    await this.props.dispatch(fetchCompetitionAction());
    this.setState({ loaded: true });
  }

  highlight(userId) {
    return get(this.props.session, "user") === userId;
  }

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }    

    const {
      competitors,
      session,
      user
    } = this.props;

    const userId = user && user._id;
    const userIsCompetitor = _.pluck(competitors, "_id").includes(userId);
    const showModal = this.state.loaded && !userIsCompetitor;

    const referralModal = <div>
      <DarkBackground
        onClick={() => this.setState({ redirect: "/home" })} />

      <ModalContainer>
        <Header.small style={{margin:"30px 0px"}}>
          join world championships
        </Header.small>

        <TextContainer>
          <p>
            Compete for iPads, Chromebooks, books, certificates, banners and a trip to New York City to compete in the World Vocabulary Finals.
          </p>

          <p>
            To enter the league, get a friend, teacher, or family member to signup for Wordcraft using this link:
          </p>
        </TextContainer>

        <p style={{color:color.blue}}>
          {userId ? `https://www.playwordcraft.com?r=${userId}` : 'calculating'}
        </p>
      </ModalContainer>
    </div>;

    const row = (rank, idx) => <Row key={idx} even={idx % 2 === 0}>
      <td style={{width:'25%'}}>
        <Rank isUser={this.highlight(rank._id)}>
          -
        </Rank>
      </td>
      <td style={{textAlign:'left',fontFamily:'BrandonGrotesque',color:color.gray2}}>
        <h3>
          {initials(rank.firstName, rank.lastName)}
        </h3>
      </td>
      <td style={{textAlign:'left',fontFamily:'BrandonGrotesque',color:color.gray2}}>
        <h4>
          {rank.nameOfSchool}
        </h4>
      </td>      
      <td style={{display:'flex',alignItems:'center',justifyContent:'center',height:'70px'}}>
        <p style={{fontSize:'1.1em',color:color.gray2}}>
          0
        </p>
        <img 
          alt="star"
          style={{height:'25px',margin:'0px 0px 4px 7px'}} 
          src={star} />
      </td>
    </Row>;  

    const leaderboard = <div>
      <Header.medium style={{color:color.green}}>
        spring world championships
      </Header.medium>

      <p style={{color:color.gray2,margin:"40px 0px 0px 0px"}}>
        starting in
      </p>

      <Header.large style={{color:color.red,margin:"0px"}}>
        {TIME_UNTIL_START}
      </Header.large>

      <TableContainer style={{marginTop:"40px"}}>
        <Table>  
          <tbody>
            {_.map(competitors, (rank, idx) => row(rank, idx))}
          </tbody>
        </Table>                
      </TableContainer>    
    </div>;

    return (
      <Container>
        {showModal && referralModal}
        {leaderboard}
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  session: state.entities.session,
  user: _.first(_.values(state.entities.user)),
  competitors: _.values(state.entities.competitors)
});

export default connect(mapStateToProps)(Championships);
