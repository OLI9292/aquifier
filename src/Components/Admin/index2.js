import Firebase from '../../Networking/Firebase';
import _ from 'underscore';
import queryString from 'query-string';
import { connect } from 'react-redux'
import { Redirect } from 'react-router';
import React, { Component } from 'react';
import get from 'lodash/get';

import { color } from '../../Library/Styles/index';
import { shouldRedirect } from '../../Library/helpers';

import {
  Container,
  Cover,
  Header,
  Text,
  StartGameButton,
  TimerContainer,
  Triangle
} from './components';


class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accessCode: 4523
    };
  }

  componentDidMount() {
    let { name, time, type, level, roots } = queryString.parse(window.location.search);
    name = name.replace('-', ' ');
    time = `${time}:00`;
    this.setState({ name: name, time: time, type: type, level: level, roots: roots }, this.getWords(this.props));
    this.hostGame();
  }

  getWords(props) {

    if (this.state.words) { return; }
    if (this.state.roots) {
console.log(2)
    } else if (props.levels.length) {
      console.log(3)
      const level = _.find(props.levels, l => l._id === this.state.level);
      console.log(props.levels)
      console.log(this.state.level)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.getWords(nextProps);
  }


  hostGame = async () => {
    Firebase.refs.games.once('value', (snapshot) => {
      const accessCode = this.generateAccessCode(_.keys(snapshot.val()));

      const game = {};
      
      game['accessCode'] = {
        status: 0,
        words: ''
      };

      /*Firebase.refs.games.update(game, (error) => {
        if (error) {
          this.setState({ errorMessage: 'Failed to create match.' });
        } else {
          this.setState({ accessCode: accessCode }, this.waitForPlayers.bind(this, accessCode));
        }
      });*/
    });
  }

  generateAccessCode(exclude) {
    return _.sample(_.range(1000, 10000).filter((n) => !_.contains(exclude, n)));
  }  

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }

    return (
      <Container>
        <Header>
          <Triangle left />
          <Cover />
          <Triangle />
          {this.state.name}
        </Header>
        
        <Text color={color.gray} size={'0.8em'}>
          access code
        </Text>

        <Text accessCode color={color.mainBlue} size={'4em'}>
          {this.state.accessCode}
        </Text>

        <TimerContainer>
          <img
            src={require('../../Library/Images/clock-black.png')}
            style={{height:'20px',width:'20px'}} />
          <p style={{margin:'10px'}}>
            {this.state.time}
          </p>
        </TimerContainer>

        <StartGameButton>
          start match
        </StartGameButton>

        <Text size={'1.1em'}>
          players
        </Text>        
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  session: state.entities.session,
  user: _.first(_.values(state.entities.user)),
  levels: _.values(state.entities.levels),
  roots: _.values(state.entities.roots)
});

export default connect(mapStateToProps)(Admin);
