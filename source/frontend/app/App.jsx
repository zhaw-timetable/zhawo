import React, { Component } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';

import './assets/sass/main.sass';
import './assets/font/font.scss';
import * as globalActions from './actions/GlobalActions';
import globalStore from './stores/GlobalStore.js';

import AppBar from './containers/TestAppBar/TestAppBar';
import TestSearch from './containers/TestAppBar/TestSearch';
import Schedule from './containers/Schedule/Schedule.jsx';
// import Nav from './containers/Nav/Nav.jsx';
import Nav from './containers/TestAppBar/BottomNavigation';
import NotFound from './containers/NotFound/NotFound.jsx';
import Login from './containers/Login/Login.jsx';
import ZHAWO from './containers/ZHAWO/ZHAWO.jsx';
import VsZHAW from './containers/VsZHAW/VsZHAW.jsx';
import Menu from './containers/Menu/Menu.jsx';
import Profile from './containers/Profile/Profile.jsx';

import history from './history';

class App extends Component {
  state = {
    appTitle: 'Timetable',
    username: globalStore.getUsername()
  };

  render() {
    const SecretRoute = ({ component: Component, ...rest }) => (
      <Route
        {...rest}
        render={props =>
          globalStore.getUsername() != '' ? (
            <div className="App">
              <AppBar />
              <Component {...props} />
              <Nav />
            </div>
          ) : window.location.pathname != '/login' ? (
            <Redirect to="/login" />
          ) : (
            <Route exact path="/login" component={Login} />
          )
        }
      />
    );

    return (
      <Router history={history}>
        <Switch>
          <SecretRoute exact path="/" component={Schedule} />
          <SecretRoute exact path="/zhawo" component={ZHAWO} />
          <SecretRoute exact path="/vszhaw" component={VsZHAW} />
          <SecretRoute exact path="/menu" component={Menu} />
          <SecretRoute exact path="/profile" component={Profile} />
          <SecretRoute exact path="/search" component={TestSearch} />
          <SecretRoute component={NotFound} />
        </Switch>
      </Router>
    );
  }
}

export default App;
