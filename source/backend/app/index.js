import '@babel/polyfill';
import path from 'path';

import logger from './logger';

import app from './app';
import config from './config.json';

// send index.html as route handler on unhandled get requests
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/bundle/index.html'));
});

app.server.listen(process.env.PORT || config.port, () => {
  let host = app.server.address().address;
  host = host == '::' ? 'localhost' : host;
  logger.log(
    `Express.js server listening on http://${host}:${app.server.address().port}`
  );
});
