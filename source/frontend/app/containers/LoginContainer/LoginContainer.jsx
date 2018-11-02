import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import './LoginContainer.sass';

import globalStore from '../../stores/GlobalStore';
import * as globalActions from '../../actions/GlobalActions';

import Splash from '../../assets/img/Splash/Splash';

class LoginContainer extends Component {
  state = {
    input: 'bachmdo2',
    redirectToPreviousRoute: false
  };

  // Bind change listener
  componentWillMount() {
    globalStore.on('current_user_changed', this.login);
  }

  // Unbind change listener
  componentWillUnmount() {
    globalStore.removeListener('current_user_changed', this.login);
  }

  handleUsernameInputChange = e => {
    this.setState({ input: e.target.value });
  };

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      this.setCurrentUser();
    }
  };

  login = () => {
    this.setState({ redirectToPreviousRoute: true });
  };

  setCurrentUser = () => {
    // Sets globalStore currentUser to value of input
    globalActions.setCurrentUser(this.state.input);
  };

  render() {
    const from = { pathname: '/' };
    const { redirectToPreviousRoute } = this.state;

    if (redirectToPreviousRoute) {
      return <Redirect to={from} />;
    }
    return (
      <div className="LoginContainer">
        <Splash />
        <div className="formContainer">
          <div className="group">
            <input
              placeholder="Username"
              defaultValue={this.state.input}
              type="text"
              required
              onChange={this.handleUsernameInputChange}
              onKeyPress={this.handleKeyPress}
            />
          </div>
          <button onClick={this.setCurrentUser}>Let's Go</button>
        </div>
      </div>
    );
  }
}

export default LoginContainer;
