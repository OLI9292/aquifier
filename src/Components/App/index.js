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
import Spectator from '../Spectator/index';
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
          <Route exact path='/settings-single' component={() => <Container component='settings' players='single' />} />
          <Route exact path='/settings-multi' component={() => <Container component='settings' players='multi' />} />
          <Route exact path='/game/spectator' component={() => <Container component='spectator' />} />
          <Route exact path='/game/:accessCode?/:status?' component={GameComponent} />
        </Switch>
      </BrowserRouter>
    );
  }
}

const GameComponent = ({ match }) => {
  if (match.params.accessCode) {
    return <Container component='game' accessCode={match.params.accessCode} status={match.params.status} />
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
          return <Game late={this.props.late} accessCode={this.props.accessCode} status={this.props.status} />
        case 'settings':
          return <Settings players={this.props.players} />
        case 'spectator':
          return <Spectator />
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
  background-color: ${color.lightestGray};
  width: 100%;
  height: 100%;
`

const InnerFrame = styled.div`
  width: 80%;
  max-width: 900px;
  margin: auto;
  margin-top: 25px;
  background-color: white;  
  border-radius: 10px;
`

export default App;
