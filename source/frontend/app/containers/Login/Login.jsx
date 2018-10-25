import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import './Login.sass';

import globalStore from '../../stores/GlobalStore';
import * as globalActions from '../../actions/GlobalActions';

import Splash from '../../img/Splash/Splash';

class Login extends Component {
  state = {
    input: '',
    redirectToPreviousRoute: false
  };

  // Bind change listener
  componentWillMount() {
    globalStore.on('username_changed', this.login);
  }

  // Unbind change listener
  componentWillUnmount() {}

  handleUsernameInputChange = e => {
    this.setState({ input: e.target.value });
  };

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      const currentDate = new Date();
      this.setUsername();
    }
  };

  login = () => {
    this.setState({ redirectToPreviousRoute: true });
  };

  setUsername = () => {
    // Sets globalStore username to value of input
    globalActions.setUsername(this.state.input);
  };

  render() {
    const from = { pathname: '/' };
    const { redirectToPreviousRoute } = this.state;

    if (redirectToPreviousRoute) {
      return <Redirect to={from} />;
    }
    return (
      <div className="Login">
        <Splash />
        <div className="formContainer">
          <div className="group">
            <input
              placeholder="Username"
              type="text"
              required
              onChange={e => this.handleUsernameInputChange(e)}
              onKeyPress={e => this.handleKeyPress(e)}
            />
          </div>
          <button onClick={() => this.setUsername()}>Let's Go</button>
        </div>
      </div>
    );
  }
}

export default Login;
