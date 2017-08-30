import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import styled from 'styled-components';

import Game from '../Game/index';
import Header from '../Header/index';
import Home from '../Home/index';
import InfoForm from '../InfoForm/index';
import Lobby from '../Lobby/index';
import Join from '../Join/index';
import Settings from '../Settings/index';
import Admin from '../Admin/index';
import Waiting from '../Waiting/index';
import { color } from '../../Assets/Styles/index';
import './index.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/lobby' component={() => <Container component='lobby' />} />
          <Route exact path='/join' component={() => <Container component='join' />} />
          <Route exact path='/settings' component={() => <Container component='settings' />} />
          <Route exact path='/settings/multiplayer' component={() => <Container component='settings' multiplayer={true} />} />
          <Route exact path='/game/admin' component={() => <Container component='admin' />} />
          <Route exact path='/game/:accessCode?/:notYetStarted?' component={GameComponent} />
        </Switch>
      </BrowserRouter>
    );
  }
}

const GameComponent = ({ match }) => {
  if (match.params.accessCode) {
    if (match.params.notYetStarted) {
      return <Container component='waiting' accessCode={match.params.accessCode} />
    } else {
      return <Container component='game' accessCode={match.params.accessCode} />
    }
  } else {
    return <Container component='game' />
  }
}

class Container extends Component {
  render() {
    const component = () => {
      switch (this.props.component) {
        case 'lobby':
          return <Lobby />
        case 'join':
          return <Join />
        case 'game':
          return <Game late={this.props.late} accessCode={this.props.accessCode} />
        case 'settings':
          return <Settings multiplayer={this.props.multiplayer} />
        case 'admin':
          return <Admin />
        case 'waiting':
          return <Waiting accessCode={this.props.accessCode} status={this.props.status} />
      }
    }

    return (
      <OuterFrame>
        <Header />
        <InnerFrame>
          {component()}
        </InnerFrame>
      </OuterFrame>
    );
  }
}

const OuterFrame = styled.div`
  height: 100%;
  width: 100%;
  min-width: 600px;
  background-color: ${color.lightestGray};
  display: block;
  overflow: auto;
`

const InnerFrame = styled.div`
  width: 80%;
  max-width: 900px;
  min-height: 80%;
  margin-top: 2.5%;
  margin-bottom: 2.5%;
  margin-left: auto;
  margin-right: auto;
  background-color: white;  
  border-radius: 10px;
`

export default App;
