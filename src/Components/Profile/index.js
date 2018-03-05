import { connect } from 'react-redux'
import React, { Component } from 'react';
import _ from 'underscore';
import queryString from 'query-string';
import get from 'lodash/get';

import starIcon from '../../Library/Images/icon-stars.png';
import bookIcon from '../../Library/Images/icon-book.png';
import yellowStar from '../../Library/Images/icon-star-yellow.png';
import orangeBadge from '../../Library/Images/icon-badge-orange.png';
import redBadge from '../../Library/Images/icon-badge-red.png';
import archer from '../../Library/Images/icon-archer-purple.png';
import grayStar from '../../Library/Images/icon-star-gray.png';
import book from '../../Library/Images/Book.png';

import { color, } from '../../Library/Styles/index';
import { Container } from '../Common/container';

import { fetchSchoolAction, fetchWordsAction, fetchLeaderboardsAction } from '../../Actions/index';

import {
  BlankRow,
  BookContainer,
  BookStats,
  Definition,
  DefinitionRow,
  HeaderStats,
  LeftRowContent,
  StarImage
} from './components';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {}

    this.checkScroll = this.checkScroll.bind(this);
  }

  checkScroll() {
    if (!this.book) { return; }
    const { fixedStats } = this.state;
    const distFromTop = this.book.getBoundingClientRect().top;  
    const scrollTop = document.documentElement.scrollTop;

    if (fixedStats && scrollTop < this.state.scrollTop) {
      this.setState({ fixedStats: false });
    } else if (!fixedStats && distFromTop < window.innerHeight * 0.15) {
      this.setState({ fixedStats: true, scrollTop: scrollTop });
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.checkScroll);

    if (_.isEmpty(this.props.words)) { this.props.dispatch(fetchWordsAction()); }
    this.loadSchool();
    this.loadLeaderboards();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.loadingSchool) { this.loadSchool(); }
    if (!this.state.loadingLeaderboards) { this.loadLeaderboards(); }
  }

  loadSchool() {
    const id = get(this.props.user, 'school')
    if (id) {
      this.setState({ loadingSchool: true });
      this.props.dispatch(fetchSchoolAction(id));
    }
  }

  loadLeaderboards() {
    const id = get(this.props.user, '_id');
    const session = this.props.session;
    if (id && session) {
      const query = queryString.stringify({ user: id });
      this.setState({ loadingLeaderboards: true });
      this.props.dispatch(fetchLeaderboardsAction(query, session));
    }
  }  

  stat(type) {
    const user = this.props.user;

    switch (type) {
      case 'totalStars':
        return _.reduce(user.words, (acc, w) => acc + w.experience, 0);
      case 'wordsLearned':
        return user.words.length;
      case 'wordAccuracy':
        const seen = _.reduce(user.words, (acc, w) => acc + w.seen, 0);
        const correct = _.reduce(user.words, (acc, w) => acc + w.correct, 0);
        return Math.round((seen / Math.max(correct, 1)) * 100);
      default:
        return 'N/A';        
    }
  }

  headerText(user) {
    let text = user.firstName;
    if (user.lastName) { text += ' ' + user.lastName};
    text += "'s progress";
    return text.toUpperCase();
  }

  ranks(ranks, userId) {
    if (_.isEmpty(ranks) || !userId) { return ['-','-']; }
    const myAllTimeRanks = _.filter(ranks, r => r.id.includes(userId) && r.period === 'all');
    return _.map(_.partition(myAllTimeRanks, r => r.group === 'Earth'), ranks => get(_.first(ranks), 'position'));
  }  

  render() {
    const {
      ranks,
      school,
      session,
      user,
      words
    } = this.props;

    const definition = value => {
      const word = _.find(words, w => w.value === value);
      return word && _.map(word.definition, d => {
        return <span style={{color:d.isRoot ? color.warmYellow : color.darkGray}}>
          {d.value}
        </span>
      });
    }

    const header = () => {
      return <div style={{paddingTop:'20px'}}>
        <p style={{fontFamily:'EBGaramond'}}>
          {get(school, 'name')}
        </p>      
        <p style={{fontFamily:'BrandonGrotesqueBold',fontSize:'2em',color:color.honey,height:'20px',lineHeight:'20px'}}>
          {this.headerText(user)}
        </p>
      </div>
    };
    
    const headerStats = () => {
      return <HeaderStats>
        <div style={{height:'100%'}}>
          <img
            alt={'star icon'}
            src={starIcon}
            style={{height:'42px',width:'auto'}} />
          <h3 style={{height:'0',lineHeight:'0',fontSize:'0.8em',fontFamily:'BrandonGrotesque'}}>
            TOTAL STARS
          </h3>
          <h1 style={{fontFamily:'EBGaramondSemiBold',color:color.mainBlue,fontSize:'2.5em',height:'0',lineHeight:'10px'}}>
            {this.stat('totalStars')}
          </h1>
        </div>
        <div style={{height:'100%'}}>
          <img
            alt={'book icon'}
            src={bookIcon}
            style={{height:'35px',width:'auto',marginTop:'3px',marginBottom:'4px'}} />          
          <h3 style={{height:'0',lineHeight:'0',fontSize:'0.8em',fontFamily:'BrandonGrotesque'}}>
            WORDS LEARNED
          </h3>
          <h1 style={{fontFamily:'EBGaramondSemiBold',color:color.mainBlue,fontSize:'2.5em',height:'0',lineHeight:'10px'}}>    
            {this.stat('wordsLearned')}
          </h1>
        </div>        
      </HeaderStats>
    };

    const tableRow = (word, idx) => {
      return <tr key={word.name} style={{backgroundColor:idx % 2 === 0 ? color.lightestGray : 'white',height:'75px'}}>
        <td style={{width:'25%'}}>
          <LeftRowContent>
            <p style={{letterSpacing:'1px',fontFamily:'BrandonGrotesqueBold',fontSize:'0.9em'}}>
              {word.name.toUpperCase()}
            </p>
            <div>
              {_.map(_.range(1,11), n => <StarImage alt={'star icon'} key={n} src={n <= word.experience ? yellowStar : grayStar} />)}
            </div>
          </LeftRowContent>
        </td>
        <DefinitionRow>
          <Definition>
            {definition(word.name)}
          </Definition>
        </DefinitionRow>
        <BlankRow />
      </tr>
    };

    const wordsTable = () => {
      return <div>
        <BookContainer>
          {sidebarStats()}
        </BookContainer>
        <table style={{borderCollapse:'collapse'}}>
          <tbody>
            {_.map(_.sortBy(user.words, 'name'), (word, idx) => tableRow(word, idx))}
          </tbody>
        </table>
      </div>
    };

    const sidebarStats = () => {
      const [schoolRank, worldRank] = this.ranks(ranks, session.user);
      const styles = this.state.fixedStats
        ? { position:'fixed',top:'15%',width:'225px',right:'0' }
        : { position:'absolute',width:'225px',right:'0' }; 
      return <div ref={book => this.book = book} style={styles}>
        <img
          alt={'book icon'}
          src={book}
          style={{width:'100%',height:'auto'}} />
        <BookStats id={'book'}>
          <div style={{marginRight:'10px'}}>
            <img
              alt={'badge icon'}
              src={redBadge}
              style={{height:'45px',width:'auto'}} />
            <h3 style={{height:'0',lineHeight:'0',fontSize:'0.7em',fontFamily:'BrandonGrotesque'}}>
              SCHOOL RANK
            </h3>                    
            <h1 style={{fontFamily:'EBGaramondSemiBold',color:color.red,fontSize:'2.25em',lineHeight:'10px'}}>
              {schoolRank}
            </h1>
          </div>
          <div style={{marginRight:'10px'}}>
            <img
              alt={'book icon'}
              src={orangeBadge}
              style={{height:'45px',width:'auto'}} />          
            <h3 style={{height:'0',lineHeight:'0',fontSize:'0.7em',fontFamily:'BrandonGrotesque'}}>
              WORLD RANK
            </h3>                    
            <h1 style={{fontFamily:'EBGaramondSemiBold',color:color.orange,fontSize:'2.25em',lineHeight:'10px'}}>
              {worldRank}
            </h1>            
          </div>
          <div style={{marginRight:'10px'}}>
            <img
              alt={'archer icon'}
              src={archer}
              style={{height:'45px',width:'auto'}} />          
            <h3 style={{height:'0',lineHeight:'0',fontSize:'0.7em',fontFamily:'BrandonGrotesque'}}>
              WORD ACCURACY
            </h3>            
            <h1 style={{fontFamily:'EBGaramondSemiBold',color:color.purple,fontSize:'2.25em',lineHeight:'10px'}}>
              {this.stat('wordAccuracy')}
            </h1>                   
          </div>
        </BookStats>
      </div>
    }

    return (
      <Container>
        {
          user && 
          <div>
            {header()}
            {headerStats()}
            {wordsTable()}
          </div>
        }
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  words: _.values(state.entities.words),
  session: state.entities.session,
  user: _.first(_.values(state.entities.user)),
  school: _.first(_.values(state.entities.school)),
  ranks: _.values(state.entities.ranks)  
})

export default connect(mapStateToProps)(Profile)
