import queryString from 'query-string';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'
import styled from 'styled-components';

// COMPONENTS
import Admin from '../Admin/index2';
import Footer from '../Footer/index';
import GameManager from '../Game/gameManager';
import GameSelect from '../GameSelect/index';
import GameSetup from '../GameSetup/index';
import Header from '../Header/index';
import Home from '../Home/index';
import InfoForm from '../InfoForm/index';
import Leaderboard from '../Leaderboard/index';
import Leaderboards from '../Leaderboards/index';
import LessonsTable from '../Dashboard/Lessons/table';
import LessonEdit from '../Dashboard/Lessons/edit';
import MyClass from '../MyClass/index';
import Profile from '../Profile/index';
import Waiting from '../Waiting/index';
import WordListsEdit from '../Dashboard/WordLists/edit';
import WordListsTable from '../Dashboard/WordLists/table';
import NotFound from '../NotFound/index';

// MODELS
import LocalStorage from '../../Models/LocalStorage'

// ETC
import { color, media, PHONE_MAX_WIDTH } from '../../Library/Styles/index';
import './index.css';

// STORE
import { activateSession, loadUser } from '../../Actions/index';
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
  }  

  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route exact path='/'                 component={Home} />
            <Route exact path='/admin'            component={contained('admin')} />            
            <Route exact path='/my-class'         component={contained('myClass')} />            
            <Route exact path='/leaderboard/:id'  component={contained('leaderboard')} />
            <Route exact path='/leaderboards'     component={contained('leaderboards')} />
            <Route exact path='/lessons'          component={contained('lessonsTable')} />
            <Route exact path='/lessons/:id'      component={contained('lessonEdit')} />
            <Route exact path='/home'             component={contained('gameSelect')} />
            <Route exact path='/setup-game'       component={contained('gameSetup')} />
            
            <Route exact path='/play/:settings' component={({ match }) => {
              return <GameManager settings={match.params.settings} /> 
            }} />

            <Route exact path='/profile'          component={contained('profile')} />
            <Route exact path='/start-free-trial' component={contained('infoForm')} />
            <Route exact path='/word-lists'       component={contained('wordListsTable')} />
            <Route exact path='/word-lists/:id'   component={contained('wordListsEdit')} />
            
            
            <Route component={contained('notFound')} />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}

const contained = component => () => <Container component={component} />

class Container extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      path: window.location.pathname
    };    

    this.checkWindowSize = this.checkWindowSize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.checkWindowSize);
    this.checkWindowSize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.checkWindowSize);
  }  

  checkWindowSize() {
    const smallScreen = document.body.clientWidth < PHONE_MAX_WIDTH;
    this.setState({ smallScreen });
  }  

  render() {
    const {
      path,
      smallScreen
    } = this.state;

    const Component = () => {
      switch (this.props.component) {
        case 'admin':              return <Admin />
        case 'gameSelect':         return <GameSelect smallScreen={smallScreen} />
        case 'gameSetup':          return <GameSetup smallScreen={smallScreen} />
        case 'infoForm':           return <InfoForm />
        case 'leaderboard':        return <Leaderboard />
        case 'leaderboards':       return <Leaderboards />
        case 'lessonsTable':       return <LessonsTable />
        case 'lessonEdit':         return <LessonEdit />
        case 'myClass':            return <MyClass />
        case 'profile':            return <Profile />
        case 'waiting':            return <Waiting settings={this.props.settings} />
        case 'wordListsEdit':      return <WordListsEdit />
        case 'wordListsTable':     return <WordListsTable />
        case 'notFound':           return <NotFound />
        default:                   return <Home />
      }
    }

    return (
      <OuterFrame>
        <Header
          path={path}
          smallScreen={smallScreen} />
        <InnerFrame>
          <ComponentFrame>
            <Component />
          </ComponentFrame>
          <Footer smallScreen={smallScreen} />
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
