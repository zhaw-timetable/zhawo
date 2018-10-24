// @flow

import dispatcher from '../dispatcher';

export function setName(text: string) {
  dispatcher.dispatch({
    type: 'SET_NAME',
    payload: text
  });
}

export function setUsername(text: string) {
  dispatcher.dispatch({
    type: 'SET_USERNAME',
    payload: text
  });
}
