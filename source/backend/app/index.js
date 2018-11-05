import '@babel/polyfill';

import logger from './logger';

import app from './app';
import config from './config.json';

app.server.listen(process.env.PORT || config.port, () => {
  let host = app.server.address().address;
  host = host == '::' ? 'localhost' : host;
  logger.log(
    `Express.js server listening on http://${host}:${app.server.address().port}`
  );
});
