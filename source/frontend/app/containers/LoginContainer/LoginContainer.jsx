import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import './LoginContainer.sass';

import globalStore from '../../stores/GlobalStore';
import * as globalActions from '../../actions/GlobalActions';

import Splash from '../../assets/img/Splash/Splash';
import LoginSearch from './components/LoginSearch/LoginSearch';

class LoginContainer extends Component {
  state = {
    redirectToPreviousRoute: false
  };

  componentWillMount() {
    globalStore.on('current_user_changed', this.login);
  }

  componentWillUnmount() {
    globalStore.removeListener('current_user_changed', this.login);
  }

  handleUsernameInputChange = e => {
    this.setState({ input: e.target.value });
  };

  login = () => {
    this.setState({ redirectToPreviousRoute: true });
  };

  render() {
    const from = { pathname: '/' };
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
