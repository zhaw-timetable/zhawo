import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import registerServiceWorker from './app/registerServiceWorker';

import App from './app/App.js';

ReactDOM.render(<App />, document.getElementById('app'));

registerServiceWorker();
