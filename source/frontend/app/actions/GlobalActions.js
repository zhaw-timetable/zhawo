import dispatcher from '../dispatcher';
import * as api from '../adapters/ZhawoAdapter';

export const setCurrentUser = (name, type) => {
  dispatcher.dispatch({
    type: 'SET_CURRENT_USER',
    payload: { name, type }
  });
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

export const toggleDrawer = () => {
  dispatcher.dispatch({
    type: 'TOGGLE_DRAWER'
  });
};

export const logout = () => {
  dispatcher.dispatch({
    type: 'LOGOUT'
  });
};

export const changeTheme = value => {
  dispatcher.dispatch({
    type: 'CHANGE_THEME',
    payload: value
  });
};

export const setDayView = value => {
  dispatcher.dispatch({
    type: 'SET_DAYVIEW',
    payload: value
  });
};
