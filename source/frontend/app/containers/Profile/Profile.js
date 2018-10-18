// @flow

import React, { Component } from 'react';
import './Profile.sass';

import globalStore from '../../stores/GlobalStore';
import * as globalActions from '../../actions/GlobalActions';

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
