import React from 'react';
import ReactDOM from 'react-dom';

import registerServiceWorker from './app/registerServiceWorker';

import App from './app/App';

ReactDOM.render(<App />, document.getElementById('app'));

registerServiceWorker();
