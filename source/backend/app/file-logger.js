// Firstly we'll need to import the fs library
let fs = require('fs');

import logger from './logger';
import { fileURLToPath } from 'url';

export const logToFile = async (file, text) => {
  let timeStamp = new Date();
  let logText = timeStamp + ' --- ' + file + ': ' + text + '\n';
  await fs.appendFile('./logs/logs.txt', logText, function(err) {
    if (err) {
      return logger.error(err);
    }

    logger.info('The file was saved!');
  });
};
