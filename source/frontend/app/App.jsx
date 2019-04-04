import React, { Component } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';

import './App.sass';

import './assets/sass/main.sass';
import './assets/font/font.scss';

import history from './history';

import globalStore from './stores/GlobalStore';

import LoginContainer from './containers/LoginContainer/LoginContainer';
import BottomNavContainer from './containers/BottomNavContainer/BottomNavContainer';
import ScheduleContainer from './containers/ScheduleContainer/ScheduleContainer';
import MensaContainer from './containers/MensaContainer/MensaContainer';
import RoomSearchContainer from './containers/RoomSearchContainer/RoomSearchContainer';
import VsZhawContainer from './containers/VsZhawContainer/VsZhawContainer';
import NotFoundContainer from './containers/NotFoundContainer/NotFoundContainer';
import DrawerContainer from './containers/DrawerContainer/DrawerContainer';

class App extends Component {
  componentWillMount() {
    globalStore.on('current_user_logout', this.handleUserChange);
    globalStore.on('theme_changed', this.handleThemeChanged);
  }

  componentWillUnmount() {
    globalStore.removeListener('current_user_logout', this.handleUserChange);
    globalStore.removeListener('theme_changed', this.handleThemeChanged);
  }

  handleUserChange = () => {
    this.forceUpdate();
  };

  handleThemeChanged = () => {
    this.forceUpdate();
  };

  render() {
    const SecretRoute = ({ component: Component, ...rest }) => (
      <Route
        {...rest}
        render={props =>
          globalStore.currentUser != '' ? (
            <div className={'App ' + globalStore.theme}>
              <DrawerContainer className={globalStore.theme} />
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
          <SecretRoute exact path="/mensa" component={MensaContainer} />
          <SecretRoute exact path="/zhawo" component={RoomSearchContainer} />
          <SecretRoute exact path="/vszhaw" component={VsZhawContainer} />
          <SecretRoute component={NotFoundContainer} />
        </Switch>
      </Router>
    );
  }
}

export default App;
