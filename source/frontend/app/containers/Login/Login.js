// @flow

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Login.sass';
import * as Actions from '../../actions/Actions.js';
import Store from '../../stores/Store.js';

import Splash from '../Splash/Splash.js';

type Props = {};
type State = {};

class Login extends Component<Props, State> {
  state = {};

  // Bind change listener
  componentWillMount() {}

  // Unbind change listener
  componentWillUnmount() {}

  render() {
    return (
      <div className="Login">
        <Splash />
        <div className="formContainer">
          <div className="group">
            <input placeholder="Username" type="text" required />
          </div>
          <Link to="/main">
            <button>Let's Go</button>
          </Link>
        </div>
      </div>
    );
  }
}

export default Login;
