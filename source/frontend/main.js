import React from 'react';
import ReactDOM from 'react-dom';

import registerServiceWorker from './app/registerServiceWorker';

import App from './app/App.jsx';

ReactDOM.render(<App />, document.getElementById('app'));

if (process.env.NODE_ENV === 'production') {
  registerServiceWorker();
}
