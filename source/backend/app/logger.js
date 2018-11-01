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
}
if (process.env.NODE_ENV === 'development') {
  signale.config({
    displayFilename: true,
    displayTimestamp: false,
    displayDate: false
  });
}
if (process.env.NODE_ENV === 'test') {
  signale.disable();
}

export default signale;
