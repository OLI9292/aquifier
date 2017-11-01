import Firebase from '../../Networking/Firebase';
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';

import Button from '../Common/button';
import TextAreas from '../TextAreas/index';
import { color } from '../../Library/Styles/index';

class Join extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accessCode: '',      
      name: localStorage.getItem('username') || '',
      redirect: null,
      isLoggedIn: !_.isNull(localStorage.getItem('userId')),
      errorMessage: 'none',
      displayError: false
    };
  }

  joinGame = async (name, accessCode, game) => {
    const success = await Firebase.joinGame(name, accessCode);
    if (success) {
      const status = game.status === 0 ? 'waiting' : 'game';
      this.setState({ redirect: `/game/name=${name}&accessCode=${accessCode}&component=${status}&multiplayer=true` });
    } else {
      this.setState({ errorMessage: 'Unable to join game.', displayError: true });
    }
  }

  handleClick = async () => {
    const name = this.state.name;
    const accessCode = this.state.accessCode;
    const result = await Firebase.canEnterGame(name, accessCode);
    const isValid = result[0];
    isValid
      ? this.joinGame(name, accessCode, result[1])
      : this.setState({ errorMessage: result[1], displayError: true });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect} />;
    }

    return (
      <Layout>
        <tr>
          <ShortRow><Text>Name</Text></ShortRow>
          <LongRow>
            {
              this.state.isLoggedIn
                ? <Username>{this.state.name}</Username>
                : <TextAreas.medium value={this.state.name} onChange={(event) => this.setState({ 'name': event.target.value })}></TextAreas.medium>
            }
          </LongRow>
        </tr>
        <br />
        <tr>
          <ShortRow><Text>Access Code</Text></ShortRow>
          <LongRow>
            <TextAreas.medium value={this.state.accessCode} onChange={(event) => this.setState({ 'accessCode': event.target.value.trim() })}>
            </TextAreas.medium>
          </LongRow>
        </tr>
        <ButtonContainer>
          <Button.extraLarge color={color.blue} onClick={this.handleClick}>Play!</Button.extraLarge>
          <ErrorMessage display={this.state.displayError}>{this.state.errorMessage}</ErrorMessage>
        </ButtonContainer>
      </Layout>
    );
  }
}

const Layout = styled.div`
  margin: auto;
  padding-top: 5%;
  width: 80%;
`

const ErrorMessage = styled.p`
  font-size: 1.25em;
  position: absolute;
  color: ${color.red};  
  visibility: ${props => props.display ? 'visible' : 'hidden'}
`

const Text = styled.h4`
  font-size: 2em;
  float: left;
`

const ShortRow = styled.td`
  width: 200px;
`

const Username = styled.p`
  font-size: 1.5em;
`

const LongRow = styled.td`
  width: 300px;
  vertical-align: middle;
`

const ButtonContainer = styled.div`
  margin-top: 100px;
  text-align: center;
`

export default Join;
