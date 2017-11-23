import axios from 'axios';
import queryString from 'query-string';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import styled from 'styled-components';

import Admin from '../Admin/index';
import ClassesDashboard from '../Dashboard/classes';
import Game from '../Game/index';
import GameSelect from '../GameSelect/index';
import Header from '../Header/index';
import Home from '../Home/index';
import InfoForm from '../InfoForm/index';
import Leaderboard from '../Leaderboard/index';
import LessonsDashboard from '../Dashboard/lessons';
import MobilePopup from '../MobilePopup/index';
import Profile from '../Profile/index';
import ReadingGameSelect from '../GameSelect/readingGameSelect';
import Waiting from '../Waiting/index';
import WordListsDashboard from '../Dashboard/wordLists';
import WordListGameSelect from '../GameSelect/wordListGameSelect';

import Word from '../../Models/Word';
import Root from '../../Models/Root';

import { color, breakpoints } from '../../Library/Styles/index';
import { mobilecheck } from '../../Library/helpers';
import './index.css';

class App extends Component {

  componentDidMount() {
    if (
      localStorage.getItem('words') &&
      localStorage.getItem('roots')
    ) { return }

    this.fetchData();
  }

  fetchData = async () => {
    axios.all([Word.fetch(), Root.fetch()])
      .then(axios.spread((res1, res2) => {
        if (!res1.data || !res2.data) {
          console.log('words/roots not found.')
        } else {
          console.log('words/roots saved.')
          localStorage.setItem('words', JSON.stringify(res1.data));
          localStorage.setItem('roots', JSON.stringify(res2.data));
        }
      }))
      .catch((err) => console.log(err))
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={Home} />

          <Route exact path='/admin/:settings' component={({ match }) => {
            return <Container component='admin' settings={queryString.parse(match.params.settings)} />
          }} />

          <Route exact path='/profile/:userId' component={({ match }) => {
            return <Container component='profile' userId={match.params.userId} />;
          }} />

          <Route exact path='/play' component={() => <Container component='gameSelect' />} />
          <Route exact path='/startfreetrial' component={() => <Container component='infoForm' />} />
          <Route path='/play/:settings' component={({ match }) => {
            const settings = queryString.parse(match.params.settings);
            const status = parseInt(settings.status, 10);
            if (settings.setup) {
              const component = `${settings.game === 'read' ? 'reading' : 'wordList'}GameSelect`;
              return <Container component={component} settings={settings} />
            } else if (status !== undefined) {
              if (status < 2) {
                return <Container component={'waiting'} settings={settings} />
              }
            }
            return <Container component={'game'} settings={settings} />
          }} />

          <Route exact path='/leaderboard/:gameId' component={({ match }) => {
            return <Container component='leaderboard' gameId={match.params.gameId} />;
          }} />

          <Route exact path='/lessons' component={() => <Container component='lessonsDashboard' />} />
          <Route exact path='/word-lists' component={() => <Container component='wordListsDashboard' />} />
          <Route exact path='/classes' component={() => <Container component='classesDashboard' />} />
        </Switch>
      </BrowserRouter>
    );
  }
}

class Container extends Component {

  render() {
    // Display not-mobile-compatible popup
    if (mobilecheck() && this.props.component !== 'home') {
      return <MobilePopup />
    };

    const component = () => {
      switch (this.props.component) {
        case 'admin': return <Admin settings={this.props.settings} />
        case 'classesDashboard': return <ClassesDashboard />
        case 'game': return <Game settings={this.props.settings} />
        case 'gameSelect': return <GameSelect />
        case 'infoForm': return <InfoForm />
        case 'leaderboard': return <Leaderboard gameId={this.props.gameId} />
        case 'lessonsDashboard': return <LessonsDashboard />
        case 'profile': return <Profile userId={this.props.userId} />
        case 'readingGameSelect': return <ReadingGameSelect settings={this.props.settings} />
        case 'waiting': return <Waiting settings={this.props.settings} />
        case 'wordListsDashboard': return <WordListsDashboard />
        case 'wordListGameSelect': return <WordListGameSelect settings={this.props.settings} />
        default: return <Home />
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
  background-color: ${color.blue};
  display: block;
  overflow: auto;
`

const InnerFrame = styled.div`
  width: 1000px;
  ${breakpoints.largeW} {
    width: 900px;
  }
  ${breakpoints.mediumW} {
    width: 800px;
  }
  padding-bottom: 25px;
  position: relative;
  margin-left: 2.5%;
  margin-right: 2.5%;
  margin: auto;
  min-height: 450px;
  margin-top: 25px;
  margin-bottom: 25px;
  background-color: white;
  border-radius: 10px;
`

export default App;
