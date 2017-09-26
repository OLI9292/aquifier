import Firebase from '../../Networking/Firebase';
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';

import Buttons from '../Buttons/default';
import TextAreas from '../TextAreas/index';
import { color } from '../../Library/Styles/index';

class Join extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accessCode: '',      
      name: '',
      redirect: null,
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
            <TextAreas.medium value={this.state.name} onChange={(event) => this.setState({ 'name': event.target.value })}>
            </TextAreas.medium>
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
          <Button onClick={this.handleClick}>Play!</Button>
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

const LongRow = styled.td`
  width: 300px;
`

const ButtonContainer = styled.div`
  margin-top: 100px;
  text-align: center;
`

const Button = Buttons.extraLarge.extend`
  background-color: ${color.blue};
  &:hover {
    background-color: ${color.blue10l};
  }
`

export default Join;
