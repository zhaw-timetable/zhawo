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

import AppBar from './containers/AppBar/AppBar.jsx';
import Timetable from './containers/Timetable/Timetable.jsx';
import Nav from './containers/Nav/Nav.jsx';
import NotFound from './containers/NotFound/NotFound.jsx';
import Login from './containers/Login/Login.jsx';
import ZHAWO from './containers/ZHAWO/ZHAWO.jsx';
import VsZHAW from './containers/VsZHAW/VsZHAW.jsx';
import Menu from './containers/Menu/Menu.jsx';
import Profile from './containers/Profile/Profile.jsx';

class App extends Component {
  state = {
    appTitle: 'Timetable'
  };

  componentDidMount() {}

  componentWillMount() {
    console.log('process.env.NODE_ENV: ' + process.env.NODE_ENV);
    globalActions.setUsernameFromDB();
  }

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
