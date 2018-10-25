import '@babel/polyfill';

import app from './app';
import config from './config.json';

app.server.listen(process.env.PORT || config.port, '0.0.0.0', () => {
  console.log(`Started on port ${app.server.address().port}`);
});
