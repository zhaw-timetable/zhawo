import dispatcher from '../dispatcher';
import * as api from '../adapters/ZhawoAdapter';

export const setCurrentUser = text => {
  dispatcher.dispatch({
    type: 'SET_CURRENT_USER',
    payload: text
  });
  console.log('SET_CURRENT_USER');
};

export const getPossibleNames = async () => {
  dispatcher.dispatch({ type: 'GET_POSSIBLE_NAMES_START' });
  console.log('GET_POSSIBLE_NAMES_START');
  const possibleNames = await api.getPossibleNames().catch(err => {
    console.error(err);
  });
  dispatcher.dispatch({
    type: 'GET_POSSIBLE_NAMES_OK',
    payload: possibleNames
  });
  console.log('GET_POSSIBLE_NAMES_OK');
};
