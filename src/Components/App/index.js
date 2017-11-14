import queryString from 'query-string';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import styled from 'styled-components';

import Admin from '../Admin/index';
import Game from '../Game/index';
import Game2 from '../Game/index2';
import Header from '../Header/index';
import Home from '../Home/index';
import MobilePopup from '../MobilePopup/index';
import InfoForm from '../InfoForm/index';
import GameSelect from '../GameSelect/index';
import WordListGameSelect from '../GameSelect/wordListGameSelect';
import ReadingGameSelect from '../GameSelect/readingGameSelect';
import Join from '../Join/index';
import Leaderboard from '../Leaderboard/index';
import ClassesDashboard from '../Dashboard/classes';
import LessonsDashboard from '../Dashboard/lessons';
import WordListsDashboard from '../Dashboard/wordLists';
import Profile from '../Profile/index';
import Lobby from '../Lobby/index';
import Waiting from '../Waiting/index';
import { color, breakpoints } from '../../Library/Styles/index';
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
          <Route exact path='/profile' component={() => <Container component='profile' />} />

          <Route exact path='/profile/:userId' component={({ match }) => {
            return <Container component='profile' userId={match.params.userId} />;
          }} />

          
          <Route exact path='/play' component={() => <Container component='gameSelect' />} />
          <Route path='/play/:settings' component={({ match }) => {
            const settings = queryString.parse(match.params.settings);
            const component = settings.setup
              ? `${settings.game === 'read' ? 'reading' : 'wordList'}GameSelect`
              : 'game';
            return <Container component={component} settings={settings} />
          }} />

          <Route exact path='/lessons' component={() => <Container component='lessonsDashboard' />} />
          <Route exact path='/word-lists' component={() => <Container component='wordListsDashboard' />} />
          <Route exact path='/classes' component={() => <Container component='classesDashboard' />} />
          <Route exact path='/education' component={() => <Container component='education' />} />
        </Switch>
      </BrowserRouter>
    );
  }
}

class Container extends Component {

  render() {
    const isMobile = mobilecheck();
    const isGame = this.props.component === 'game';

    if (isMobile && this.props.component !== 'home') { return <MobilePopup /> };
    
    const component = () => {
      switch (this.props.component) {
        case 'admin': return <Admin settings={this.props.settings} />
        case 'education': return <InfoForm />
        
        case 'game': return <Game2 settings={this.props.settings} />

        case 'gameSelect': return <GameSelect />
        case 'wordListGameSelect': return <WordListGameSelect settings={this.props.settings} />
        case 'readingGameSelect': return <ReadingGameSelect settings={this.props.settings} />

        case 'join': return <Join />
        case 'lobby': return <Lobby />
        case 'profile': return <Profile userId={this.props.userId} />
        case 'classesDashboard': return <ClassesDashboard />
        case 'lessonsDashboard': return <LessonsDashboard />
        case 'wordListsDashboard': return <WordListsDashboard />
        case 'leaderboard': return <Leaderboard settings={this.props.settings} />
        case 'waiting': return <Waiting settings={this.props.settings} />
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
