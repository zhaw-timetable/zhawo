// @flow

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Login.sass';
import * as globalActions from '../../actions/GlobalActions';
import globalStore from '../../stores/GlobalStore';

import Splash from '../Splash/Splash';

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
          <Link to="/timetable">
            <button>Let's Go</button>
          </Link>
        </div>
      </div>
    );
  }
}

export default Login;
