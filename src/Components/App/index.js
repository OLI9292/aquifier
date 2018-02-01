import queryString from 'query-string';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'
import styled from 'styled-components';

// COMPONENTS
import Admin from '../Admin/index';
import ClassesDashboard from '../Dashboard/classes';
import Footer from '../Footer/index';
import Game from '../Game/index';
import GameSelect from '../GameSelect/index';
import Header from '../Header/index';
import Home from '../Home/index';
import InfoForm from '../InfoForm/index';
import Leaderboard from '../Leaderboard/index';
import Leaderboards from '../Profile/Leaderboards/index';
import LessonsTable from '../Dashboard/Lessons/table';
import LessonEdit from '../Dashboard/Lessons/edit';
import Profile from '../Profile/index';
import ReadingGameSelect from '../GameSelect/readingGameSelect';
import Waiting from '../Waiting/index';
import WordListsEdit from '../Dashboard/WordLists/edit';
import WordListsTable from '../Dashboard/WordLists/table';
import WordListGameSelect from '../GameSelect/wordListGameSelect';

// MODELS
import LocalStorage from '../../Models/LocalStorage'

// ETC
import { color, media, PHONE_MAX_WIDTH } from '../../Library/Styles/index';
import './index.css';

// STORE
import { activateSession, loadUser, loadWords, loadRoots } from '../../Actions/index';
import configureStore from '../../Store/configureStore';
const store = configureStore();
// store.subscribe(() => console.log(store.getState()))

class App extends Component {
  componentDidMount() {
    const session = LocalStorage.getSession();
    
    if (session) { 
      store.dispatch(activateSession(session));
      store.dispatch(loadUser(session.user));
    };

    store.dispatch(loadWords());
    store.dispatch(loadRoots());
  }  

  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route exact path='/'                 component={Home} />
            <Route exact path='/classes'          component={contained('classesDashboard')} />            
            <Route exact path='/leaderboard/:id'  component={contained('leaderboard')} />
            <Route exact path='/leaderboards'     component={contained('leaderboards')} />
            <Route exact path='/lessons'          component={contained('lessonsTable')} />
            <Route exact path='/lessons/:id'      component={contained('lessonEdit')} />
            <Route exact path='/play'             component={contained('gameSelect')} />
            <Route exact path='/profile/:id'      component={contained('profile')} />
            <Route exact path='/start-free-trial' component={contained('infoForm')} />
            <Route exact path='/word-lists'       component={contained('wordListsTable')} />
            <Route exact path='/word-lists/:id'   component={contained('wordListsEdit')} />
            
            {/* ADMIN */}
            <Route exact path='/admin/:settings' component={({ match }) => {
              return <Container
                component='admin' 
                settings={queryString.parse(match.params.settings)} /> 
            }} />

            {/* GAME */}
            <Route path='/play/:settings' component={({ match }) => {
              const settings = queryString.parse(match.params.settings)
              const waiting = settings.status && parseInt(settings.status, 10) < 2
              let component

              if      (settings.setup) { component = `${settings.game === 'read' ? 'reading' : 'wordList'}GameSelect` }
              else if (waiting)        { component = 'waiting' }
              else                     { component = 'game' }

              return <Container component={component} settings={settings} />
            }} />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}

const contained = (component) => () => <Container component={component} />

class Container extends Component {
  constructor(props) {
    super(props);
    
    const path = window.location.pathname;

    this.state = {
      isHome: path === '/',
      isPlay: path === '/play',
      isLeaderboards:  path === '/leaderboards'
    };    

    this.checkWindowSize = this.checkWindowSize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.checkWindowSize);
    this.checkWindowSize();
  }

  componentWillUnmount() {
    window.addEventListener('resize', this.checkWindowSize);
  }  

  checkWindowSize() {
    const smallScreen = document.body.clientWidth < PHONE_MAX_WIDTH;
    this.setState({ smallScreen });
  }  

  render() {
    const Component = () => {
      switch (this.props.component) {
        case 'admin':              return <Admin settings={this.props.settings} />
        case 'classesDashboard':   return <ClassesDashboard />
        case 'game':               return <Game settings={this.props.settings} />
        case 'gameSelect':         return <GameSelect />
        case 'infoForm':           return <InfoForm />
        case 'leaderboard':        return <Leaderboard />
        case 'leaderboards':       return <Leaderboards />
        case 'lessonsTable':       return <LessonsTable />
        case 'lessonEdit':         return <LessonEdit />
        case 'profile':            return <Profile />
        case 'readingGameSelect':  return <ReadingGameSelect settings={this.props.settings} />
        case 'waiting':            return <Waiting settings={this.props.settings} />
        case 'wordListsEdit':      return <WordListsEdit />
        case 'wordListsTable':     return <WordListsTable />
        case 'wordListGameSelect': return <WordListGameSelect settings={this.props.settings} />
        default:                   return <Home />
      }
    }

    return (
      <OuterFrame>
        <Header
          smallScreen={this.state.smallScreen}
          isHome={this.state.isHome}
          isLeaderboards={this.state.isLeaderboards}
          isPlay={this.state.isPlay} />
        <InnerFrame>
          <ComponentFrame>
            <Component 
              smallScreen={this.state.smallScreen}
              isHome={this.state.isHome}
              isLeaderboards={this.state.isLeaderboards}
              isPlay={this.state.isPlay} />
          </ComponentFrame>
          <Footer smallScreen={this.state.smallScreen} />
        </InnerFrame>
      </OuterFrame>
    );
  }
}

const OuterFrame = styled.div`
  background-color: ${color.lightestGray};
  display: block;
  height: 100%;
  overflow: auto;
  width: 100%;  
`

const InnerFrame = styled.div`
  margin: 0 auto;
  margin-top: 120px;
  max-width: 1100px;
  width: 90%;
  ${media.phone`
    width: 100%;
    border-radius: 0px;
    margin-top: 0px;
    min-height: 100vh;
  `};  
`

const ComponentFrame = styled.div`
  background-color: white;
  border-radius: 10px;
  box-sizing: border-box;
  width: 100%;
  ${media.phone`
    width: 100%;
    border-radius: 0px;
    margin-top: 0px;
    min-height: 100vh;
  `};  
`

export default App;
