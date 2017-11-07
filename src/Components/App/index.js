import queryString from 'query-string';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import styled from 'styled-components';

import Admin from '../Admin/index';
import Game from '../Game/index';
import Lesson from '../Game/lesson';
import Header from '../Header/index';
import Home from '../Home/index';
import MobilePopup from '../MobilePopup/index';
import InfoForm from '../InfoForm/index';
import Join from '../Join/index';
import Leaderboard from '../Leaderboard/index';
import ClassesDashboard from '../Dashboard/classes';
import LessonsDashboard from '../Dashboard/lessons';
import Profile from '../Profile/index';
import Lobby from '../Lobby/index';
import Settings from '../Settings/index';
import Waiting from '../Waiting/index';
import { color } from '../../Library/Styles/index';
import { mobilecheck } from '../../Library/helpers';
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
          <Route exact path='/profile' component={() => <Container component='profile' />} />

          <Route exact path='/profile/:userId' component={({ match }) => {
            return <Container component='profile' userId={match.params.userId} />;
          }} />

          <Route exact path='/classes' component={() => <Container component='classesDashboard' />} />
          <Route exact path='/lessons' component={() => <Container component='lessonsDashboard' />} />
          <Route exact path='/education' component={() => <Container component='education' />} />
          <Route exact path='/settings/multiplayer' component={() => <Container component='settings' multiplayer={true} />} />
          <Route exact path='/game/admin/:settings' component={({ match }) => {
            return <Container component='admin' settings={queryString.parse(match.params.settings)} />;
          }} />
          <Route exact path='/game/:settings' component={({ match }) => {
            const settings = queryString.parse(match.params.settings);
            if (settings.lesson) {
              return <Container component='lesson' id={settings.lesson} />
            } else {
              return <Container component={settings.multiplayer ? settings.component : 'game'} settings={settings} />
            }
          }} />
        </Switch>
      </BrowserRouter>
    );
  }
}

class Container extends Component {

  render() {
    const isMobile = mobilecheck();
    const isGame = this.props.component === 'game';
    const styles = isGame ? { minHeight: '600px', height: '85%' } : { minHeight: '600px' };

    if (isMobile && this.props.component !== 'home') { return <MobilePopup /> };
    
    const component = () => {
      switch (this.props.component) {
        case 'admin': return <Admin settings={this.props.settings} />
        case 'education': return <InfoForm />
        case 'game': return <Game settings={this.props.settings} />
        case 'lesson': return <Lesson id={this.props.id} />
        case 'join': return <Join />
        case 'lobby': return <Lobby />
        case 'profile': return <Profile userId={this.props.userId} />
        case 'classesDashboard': return <ClassesDashboard />
        case 'lessonsDashboard': return <LessonsDashboard />
        case 'leaderboard': return <Leaderboard settings={this.props.settings} />
        case 'settings': return <Settings multiplayer={this.props.multiplayer} />
        case 'waiting': return <Waiting settings={this.props.settings} />
        default: return <Home />
      }
    }

    return (
      <OuterFrame>
        <Header />
        <InnerFrame style={styles}>
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
  padding-bottom: 10px;
  background-color: ${color.blue};
  display: block;
  overflow: auto;
`

const InnerFrame = styled.div`
  width: 80%;
  max-width: 900px;
  min-width: 750px;
  margin-top: 120px;
  margin-bottom: 2.5%;
  margin-left: auto;
  margin-right: auto;
  background-color: white;
  border-radius: 10px;
`

export default App;
