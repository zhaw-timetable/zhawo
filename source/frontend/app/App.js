// @flow

import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

import './sass/main.sass';
import './font/font.scss';
import * as globalActions from './actions/GlobalActions';
import globalStore from './stores/GlobalStore.js';

import AppBar from './containers/AppBar/AppBar.js';
import Timetable from './containers/Timetable/Timetable.js';
import Nav from './containers/Nav/Nav.js';
import NotFound from './containers/NotFound/NotFound.js';
import Login from './containers/Login/Login.js';
import ZHAWO from './containers/ZHAWO/ZHAWO.js';
import VsZHAW from './containers/VsZHAW/VsZHAW.js';
import Menu from './containers/Menu/Menu.js';
import Profile from './containers/Profile/Profile.js';

type AppProps = {
  location: any,
  history: any
};

type AppState = {
  appTitle: string,
  username: string
};

class App extends Component<AppProps, AppState> {
  state = {
    appTitle: 'Timetable',
    username: globalStore.getUsername()
  };

  componentWillMount() {
    console.log('process.env.NODE_ENV: ' + process.env.NODE_ENV);
  }

  render() {
    const LoggedOutRoutes = [<Route exact path="/login" component={Login} />];
    const LoggedInRoutes = [
      <Route exact path="/timetable" component={Timetable} />,
      <Route exact path="/zhawo" component={ZHAWO} />,
      <Route exact path="/vszhaw" component={VsZHAW} />,
      <Route exact path="/menu" component={Menu} />,
      <Route exact path="/profile" component={Profile} />
    ];

    // TODO: need to know if is a correct username

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
      <Router>
        <Switch>
          <SecretRoute exact path="/" component={Timetable} />
          <SecretRoute exact path="/zhawo" component={ZHAWO} />
          <SecretRoute exact path="/vszhaw" component={VsZHAW} />
          <SecretRoute exact path="/menu" component={Menu} />
          <SecretRoute exact path="/profile" component={Profile} />
          <SecretRoute component={NotFound} />
        </Switch>
      </Router>
    );
  }
}

export default App;
