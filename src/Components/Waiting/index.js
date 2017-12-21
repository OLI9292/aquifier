import { connect } from 'react-redux'
import queryString from 'query-string';
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';

import Button from '../Common/button';
import Firebase from '../../Networking/Firebase';
import { color } from '../../Library/Styles/index';

class Waiting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: 'Be patient while other players join...',
      redirect: false,
      game: {}
    }
  }

  componentDidMount() {
    // TODO: - check this is a consistent username
    const username = this.props.user && `${this.props.user.firstName} ${this.props.user.lastName.charAt(0)}`;

    Firebase.refs.games.child(this.props.settings.accessCode).on('value', (snapshot) => {
      
      const game = _.pick(snapshot.val(), 'wordList', 'time', 'startTime');
      if (_.isEmpty(this.state.game)) { this.setState({ game }) };
      
      const kicked = !_.includes(_.keys(snapshot.val().players), username);
      const gameStarted = snapshot.val().status === 1;

      if (kicked) {
        this.setState({ text: 'You were kicked by the admin.' });
      } else if (gameStarted) {
        this.setState({ redirect: true });
      }
    });
  }

  componentWillUnmount() {
    Firebase.refs.games.child(this.props.settings.accessCode).off();
  }

  render() {
    if (this.state.redirect && !window.location.href.endsWith(this.state.redirect)) {
      const multiplayerGame = _.extend(this.state.game, { players: 'multi', accessCode: this.props.settings.accessCode });
      const redirect = this.state.text.includes('kicked')
        ? '/play'
        : `/play/${queryString.stringify(multiplayerGame)}`;
      return <Redirect push to={redirect} />;
    }

    return (
      <div style={{margin:'0 auto',paddingTop:'5%',textAlign:'center',width:'65%'}}>
        <p style={{fontSize:'3em'}}>
          {this.state.text}
        </p>
        {
          this.state.text.includes('kicked') && 
          <Button.medium color={color.blue} onClick={() => this.setState({ redirect: true })}>
            Join Again
          </Button.medium>
        }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  user: _.first(_.values(state.entities.user)),
  session: state.entities.session
});

export default connect(mapStateToProps)(Waiting);
