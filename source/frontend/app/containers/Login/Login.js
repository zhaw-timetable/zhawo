// @flow

import React, { Component } from 'react';
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
        <button>hi</button>
      </div>
    );
  }
}

export default Login;
