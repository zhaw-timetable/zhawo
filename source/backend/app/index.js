import '@babel/polyfill';
import path from 'path';

import logger from './logger';

import * as createRooms from './createRoomsJson';

import app from './app';
import config from './config.json';

// send index.html as route handler on unhandled get requests
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/bundle/index.html'));
});

let port = config.port;
// if (process.env.NODE_ENV === 'development') {
//   port = config.devPort;
// }

app.server.listen(port, () => {
  let host = app.server.address().address;
  host = host == '::' ? 'localhost' : host;
  logger.log(
    `Express.js server listening on http://${host}:${app.server.address().port}`
  );
});

// run every 24hrs
setInterval(createRooms.createFreeRoomsJson, 1000 * 60 * 60 * 24);
createRooms.createFreeRoomsJson();
