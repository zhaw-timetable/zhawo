import { Signale } from 'signale';

const signale = new Signale({
  scope: 'backend'
});

signale.config({
  displayFilename: true,
  displayTimestamp: true,
  displayDate: true
});

export default signale;
