import dispatcher from '../dispatcher';

export const setCurrentUser = (name, type) => {
  dispatcher.dispatch({
    type: 'SET_CURRENT_USER',
    payload: { name, type }
  });
};

export const getPossibleNames = async () => {
  dispatcher.dispatch({ type: 'GET_POSSIBLE_NAMES' });
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

export const setViewState = value => {
  dispatcher.dispatch({
    type: 'SET_VIEWSTATE',
    payload: value
  });
};

export const getViewState = () => {
  dispatcher.dispatch({
    type: 'GET_VIEWSTATE'
  });
};
