import '@babel/polyfill';

import app from './app';
import config from './config.json';

let port = process.env.PORT;
if (port == null || port == '') {
  port = config.port;
}

app.server.listen(port, () => {
  console.log(`Started on port ${app.server.address().port}`);
});
