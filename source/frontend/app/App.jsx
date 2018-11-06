import React, { Component } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';

import './assets/sass/main.sass';
import './assets/font/font.scss';

import history from './history';

import * as globalActions from './actions/GlobalActions';
import globalStore from './stores/GlobalStore.js';

import scheduleStore from './stores/ScheduleStore';
import * as scheduleActions from './actions/ScheduleActions';

import AppBarContainer from './containers/AppBarContainer/AppBarContainer';
import LoginContainer from './containers/LoginContainer/LoginContainer';
import BottomNavContainer from './containers/BottomNavContainer/BottomNavContainer';

import ScheduleContainer from './containers/ScheduleContainer/ScheduleContainer';
import MensaContainer from './containers/MensaContainer/MensaContainer';
import RoomSearchContainer from './containers/RoomSearchContainer/RoomSearchContainer.jsx';
import VsZhawContainer from './containers/VsZhawContainer/VsZhawContainer';

import NotFoundContainer from './containers/NotFoundContainer/NotFoundContainer.jsx';

class App extends Component {
  state = {
    appTitle: 'Timetable',
    username: globalStore.currentUser
  };

  // Bind change listener
  componentWillMount() {
    console.log('process.env.NODE_ENV: ' + process.env.NODE_ENV);
    // globalActions.setUsernameFromDB();
    // globalStore.on('current_user_changed', this.handleUsernameChanged);
  }

  // Unbind change listener
  componentWillUnmount() {
    // globalStore.removeListener(
    //   'current_user_changed',
    //   this.handleUsernameChanged
    // );
  }

  render() {
    const SecretRoute = ({ component: Component, ...rest }) => (
      <Route
        {...rest}
        render={props =>
          globalStore.currentUser != '' ? (
            <div className="App">
              <AppBarContainer />
              <Component {...props} />
              <BottomNavContainer />
            </div>
          ) : window.location.pathname != '/login' ? (
            <Redirect to="/login" />
          ) : (
            <Route exact path="/login" component={LoginContainer} />
          )
        }
      />
    );

    return (
      <Router history={history}>
        <Switch>
          <SecretRoute exact path="/" component={ScheduleContainer} />
          <SecretRoute exact path="/menu" component={MensaContainer} />
          <SecretRoute exact path="/zhawo" component={RoomSearchContainer} />
          <SecretRoute exact path="/vszhaw" component={VsZhawContainer} />
          <SecretRoute component={NotFoundContainer} />
        </Switch>
      </Router>
    );
  }
}

export default App;
