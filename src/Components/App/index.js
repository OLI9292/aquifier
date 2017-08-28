import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import Demo from '../Demo/index';
import Home from '../Home/index';
import Settings from '../Settings/index';
import InfoForm from '../InfoForm/index';
import './index.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/demo' component={Demo} />
          <Route exact path='/settings-single' component={() => (<Settings players='single' />)} />
          <Route exact path='/settings-multi' component={() => (<Settings players='multi' />)} />
          <Route exact path='/bringToMySchool' component={InfoForm} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
