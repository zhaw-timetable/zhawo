// @flow

import React, { Component } from 'react';
import './Profile.sass';
import * as Actions from '../../actions/Actions.js';
import Store from '../../stores/Store.js';

type Props = {};
type State = {};

class Profile extends Component<Props, State> {
  state = {};

  // Bind change listener
  componentWillMount() {}

  // Unbind change listener
  componentWillUnmount() {}

  render() {
    return (
      <div className="Profile">
        <h1>Profile</h1>
      </div>
    );
  }
}

export default Profile;
