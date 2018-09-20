import dispatcher from '../dispatcher';

export function setName(text) {
  dispatcher.dispatch({
    type: 'SET_NAME',
    text
  });
}
