import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import App from './app/App.js';
import Login from './app/containers/Login/Login.js';
import NotFound from './app/containers/NotFound/NotFound.js';

const routing = (
  <Router>
    <Switch>
      <Route exact path="/" component={Login} />
      <Route path="/app" component={App} />
      <Route component={NotFound} />
    </Switch>
  </Router>
);

ReactDOM.render(routing, document.getElementById('app'));
