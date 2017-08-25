import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home/index';
import Demo from '../Demo/index';
import InfoForm from '../InfoForm/index';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/demo' component={Demo}/>
          <Route exact path='/bringToMySchool' component={InfoForm}/>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
