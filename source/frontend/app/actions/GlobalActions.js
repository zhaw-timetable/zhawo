// @flow

import dispatcher from '../dispatcher';

export function setName(text: string) {
  dispatcher.dispatch({
    type: 'SET_NAME',
    payload: text
  });
}
