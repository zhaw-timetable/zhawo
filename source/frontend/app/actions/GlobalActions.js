import dispatcher from '../dispatcher';

/**
 * Dispatches action to set a specific user as the current global user
 * requries username and type (student, teacher)
 * @param {string} name
 * @param {string} type
 */
export const setCurrentUser = (name, type) => {
  dispatcher.dispatch({
    type: 'SET_CURRENT_USER',
    payload: { name, type }
  });
};

/**
 * Dispatches action to make API call to fetch all Usernames
 */
export const getPossibleNames = async () => {
  dispatcher.dispatch({ type: 'GET_POSSIBLE_NAMES' });
};

/**
 * Dispatches action to toggle Drawer State in Store
 */
export const toggleDrawer = () => {
  dispatcher.dispatch({
    type: 'TOGGLE_DRAWER'
  });
};

/**
 * Dispatches action to remove current global user and remove View State from DB
 */
export const logout = () => {
  dispatcher.dispatch({
    type: 'LOGOUT'
  });
};

/**
 * Dispatches action to set a global theme
 * requries theme type (darkTheme,lightTheme)
 * @param {string} value
 */
export const changeTheme = value => {
  dispatcher.dispatch({
    type: 'CHANGE_THEME',
    payload: value
  });
};

/**
 * Dispatches action to set if dayview or not (=weekview)
 * @param {boolean} value
 */
export const setDayView = value => {
  dispatcher.dispatch({
    type: 'SET_DAYVIEW',
    payload: value
  });
};

/**
 * Dispatches action to set current ViewState
 * @param {number} value
 */
export const setViewState = value => {
  dispatcher.dispatch({
    type: 'SET_VIEWSTATE',
    payload: value
  });
};

/**
 * Dispatches action to read saved ViewSate from idb and sets it as current ViewState
 */
export const getViewState = () => {
  dispatcher.dispatch({
    type: 'GET_VIEWSTATE'
  });
};
