import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'
import styled from 'styled-components';

// COMPONENTS
import Admin from '../Admin/index';
import Footer from '../Footer/index';
import GameManager from '../Game/gameManager';
import GameSelect from '../GameSelect/index';
import GameSetup from '../GameSetup/index';
import Header from '../Header/index';
import Home from '../Home/index';
import InfoForm from '../InfoForm/index';
import Leaderboard from '../Leaderboard/index';
import Leaderboards from '../Leaderboards/index';
import MyClass from '../MyClass/index';
import Profile from '../Profile/index';
import NotFound from '../NotFound/index';

// MODELS
import LocalStorage from '../../Models/LocalStorage'

// ETC
import { color, media } from '../../Library/Styles/index';
import './index.css';

// STORE
import { activateSessionAction, fetchUserAction } from '../../Actions/index';
import configureStore from '../../Store/configureStore';
const store = configureStore();
// store.subscribe(() => console.log(store.getState()))

class App extends Component {
  componentDidMount() {
    const session = LocalStorage.getSession();
    
    if (session) { 
      store.dispatch(activateSessionAction(session));
      store.dispatch(fetchUserAction(session.user));
    };
  }  

  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route exact path='/'                 component={Home} />
            <Route exact path='/admin'            component={contained('admin')} />            
            <Route exact path='/leaderboard/:id'  component={contained('leaderboard')} />
            <Route exact path='/leaderboards'     component={contained('leaderboards')} />
            <Route exact path='/home'             component={contained('gameSelect')} />
            <Route exact path='/my-class'         component={contained('myClass')} />            
            <Route exact path='/profile'          component={contained('profile')} />            
            <Route exact path='/play/:settings'   component={({ match }) => {
              return <GameManager settings={match.params.settings} /> 
            }} />
            <Route exact path='/setup-game'       component={contained('gameSetup')} />
            <Route exact path='/start-free-trial' component={contained('infoForm')} />
            <Route                                component={contained('notFound')} />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}

const contained = component => () => <Container component={component} />

class Container extends Component {
  render() {
    const Component = () => {
      switch (this.props.component) {
        case 'admin':        return <Admin />
        case 'gameSelect':   return <GameSelect />
        case 'gameSetup':    return <GameSetup />
        case 'infoForm':     return <InfoForm />
        case 'leaderboard':  return <Leaderboard />
        case 'leaderboards': return <Leaderboards />
        case 'myClass':      return <MyClass />
        case 'profile':      return <Profile />
        case 'notFound':     return <NotFound />
        default:             return <Home />
      }
    }

    return (
      <OuterFrame>
        <Header path={window.location.pathname} />
        <InnerFrame>
          <ComponentFrame>
            <Component />
          </ComponentFrame>
          <Footer />
        </InnerFrame>
      </OuterFrame>
    );
  }
}

const OuterFrame = styled.div`
  background-color: ${color.lightestGray};
  width: 100%;  
  position: absolute;
  top: 0;
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
