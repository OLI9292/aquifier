import { Redirect } from 'react-router';
import React, { Component } from 'react';
import { connect } from 'react-redux'
import get from "lodash/get";
import styled from 'styled-components';
import _ from 'underscore';

import openSocket from 'socket.io-client';

import Button from '../../Common/button';
import { shouldRedirect } from '../../../Library/helpers';
import { color, media } from '../../../Library/Styles/index';

import {
  joinGameAction
} from '../../../Actions/index';

const socket = openSocket('http://localhost:3002');

class Battle extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  findOpponent() {
    const userId = get(this.props.session, "user");
    if (!userId && this.state.matchmaking) { return; }
    this.setState({ matchmaking: true }, () => this.props.dispatch(joinGameAction(userId)));
  }

  componentDidMount() {
    //this.subscribeToTimer(() => console.log('componentDidMount'));
  }

  subscribeToTimer(cb) {
    socket.on('timer', timestamp => console.log(timestamp));
    socket.emit('subscribeToTimer', 1000);
  }  

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }

    return (
      <Container>
        <Button.medium onClick={this.findOpponent.bind(this)}>
          find opponent
        </Button.medium>
      </Container>
    );
  }
}

const Container = styled.div`
  padding: 20px 0px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  ${media.phone`
    padding: 0;
    min-height: 80vh;
  `}; 
`

const mapStateToProps = (state, ownProps) => ({
  session: state.entities.session,
  user: _.first(_.values(state.entities.user)),
});

export default connect(mapStateToProps)(Battle);
