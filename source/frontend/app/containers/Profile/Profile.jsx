import React, { Component } from 'react';
import './Profile.sass';

import globalStore from '../../stores/GlobalStore';
import * as globalActions from '../../actions/GlobalActions';

class Profile extends Component {
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
