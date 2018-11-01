import { Signale } from 'signale';

const signale = new Signale({
  scope: 'backend'
});

signale.config({
  displayFilename: true,
  displayTimestamp: true,
  displayDate: true
});

import app from './app';
import config from './config.json';

app.server.listen(process.env.PORT || config.port, () => {
  let host = app.server.address().address;
  host = host == '::' ? 'localhost' : host;
  signale.success(
    `Express.js server listening on http://${host}:${app.server.address().port}`
  );
});
