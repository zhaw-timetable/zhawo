import dispatcher from '../dispatcher';

export const setCurrentUser = text => {
  dispatcher.dispatch({
    type: 'SET_CURRENT_USER',
    payload: text
  });
};
