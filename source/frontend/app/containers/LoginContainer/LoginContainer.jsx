import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import './LoginContainer.sass';

import globalStore from '../../stores/GlobalStore';

import Splash from '../../assets/img/Splash/Splash';
import LoginSearch from './components/LoginSearch/LoginSearch';

/**
 * Login Component.
 * Login page shown to users that are not loggin.
 *
 * @class LoginContainer
 * @extends {Component}
 */
class LoginContainer extends Component {
  state = {
    redirectToPreviousRoute: false
  };

  componentWillMount() {
    globalStore.on('current_user_login', this.login);
  }

  componentWillUnmount() {
    globalStore.removeListener('current_user_login', this.login);
  }

  /**
   * Function called when store changes
   * Set local state redirectToPreviousRoute to true.
   * This allows user to be redirected to next Component.
   * @memberof LoginContainer
   */
  login = () => {
    this.setState({
      redirectToPreviousRoute: true
    });
  };

  /**
   * Function that pushes view to history so Components can be changed using react router.
   *
   * @memberof LoginContainer
   */
  getCurrentViewPath = () => {
    let currentViewPath = '';
    switch (globalStore.viewState) {
      case 0:
        currentViewPath = '/';
        break;
      case 1:
        currentViewPath = '/mensa';
        break;
      case 2:
        currentViewPath = '/zhawo';
        break;
      case 3:
        currentViewPath = '/vszhaw';
        break;
      default:
        currentViewPath = '/';
    }
    return currentViewPath;
  };

  render() {
    let currentViewPath = this.getCurrentViewPath();
    const from = { pathname: currentViewPath };
    const { redirectToPreviousRoute } = this.state;

    if (redirectToPreviousRoute) {
      return <Redirect to={from} />;
    }
    return (
      <div className="LoginContainer">
        <div className="LoginBox">
          <Splash />
          <LoginSearch />
        </div>
      </div>
    );
  }
}

export default LoginContainer;
