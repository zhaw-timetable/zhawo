import React, { Component } from 'react';

// For flux
import * as Actions from './actions/Actions.js';

import Store from './stores/Store.js';

import FluxExample from './containers/FluxExample/FluxExample.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <FluxExample />
      </div>
    );
  }
}
export default App;
