import queryString from 'query-string';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { Redirect } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import styled from 'styled-components';

import Admin from '../Admin/index';
import Game from '../Game/index';
import Header from '../Header/index';
import Home from '../Home/index';
import Join from '../Join/index';
import Leaderboard from '../Leaderboard/index';
import Lobby from '../Lobby/index';
import Settings from '../Settings/index';
import Waiting from '../Waiting/index';
import { color } from '../../Library/Styles/index';
import { toArr } from '../../Library/helpers';
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
          <Route exact path='/game/admin/:settings' component={({ match }) => {
            const settings = queryString.parse(match.params.settings);
            return <Container component='admin' time={settings.time} level={settings.level} topics={toArr(settings.topic)} />;
          }} />
          <Route path='/game/sp/:settings' component={GameComponent} />
          <Route exact path='/game/:accessCode?/:status' component={GameComponent} />
        </Switch>
      </BrowserRouter>
    );
  } 
}

const GameComponent = ({ match }) => {
  const settings = queryString.parse(match.params.settings);
  if (match.params.accessCode) {
    if (match.params.status === 'waiting') {
      return <Container component='waiting' accessCode={match.params.accessCode} />
    } else if (match.params.status === 'play') {
      return <Container component='game' accessCode={match.params.accessCode} />
    } else if (match.params.status === 'over') {
      return <Container component='leaderboard' accessCode={match.params.accessCode} />
    }
  } else {
    return <Container component='game' time={settings.time} level={settings.level} topics={toArr(settings.topic)} />
  }
}

class Container extends Component {
  render() {
    const component = () => {
      switch (this.props.component) {
        case 'admin':
          return <Admin time={this.props.time} level={this.props.level} topics={this.props.topics} />
        case 'game':
          return <Game accessCode={this.props.accessCode} time={this.props.time} level={this.props.level} topics={this.props.topics} />
        case 'join':
          return <Join />
        case 'lobby':
          return <Lobby />
        case 'leaderboard':
          return <Leaderboard accessCode={this.props.accessCode} />
        case 'settings':
          return <Settings multiplayer={this.props.multiplayer} />
        case 'waiting':
          return <Waiting accessCode={this.props.accessCode} status={this.props.status} />
        default:
          return <Home />
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
