import { Signale } from 'signale';

const signale = new Signale({
  scope: 'backend'
});

if (process.env.NODE_ENV === 'production') {
  signale.config({
    displayFilename: true,
    displayTimestamp: true,
    displayDate: true
  });
} else {
  signale.config({
    displayFilename: true,
    displayTimestamp: false,
    displayDate: false
  });
}

export default signale;
