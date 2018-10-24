import dispatcher from '../dispatcher';

export function setUsername(text) {
  dispatcher.dispatch({
    type: 'SET_USERNAME',
    payload: text
  });
}
