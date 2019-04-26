// Firstly we'll need to import the fs library
let fs = require('fs');

import logger from './logger';
import { fileURLToPath } from 'url';

import { format } from 'date-fns';

export const logToFile = async (file, text) => {
  let timeStamp = new Date();
  let fileName = format(timeStamp, 'YYYY-MM-DD');
  let logText = timeStamp + ' --- ' + file + ': ' + text + '\n';
  await fs.appendFile('../logs/' + fileName + '-Logs.txt', logText, function(
    err
  ) {
    if (err) {
      return logger.error(err);
    }

    logger.info('The file was saved!');
  });
};
