import dispatcher from '../dispatcher';

import globalStore from '../stores/GlobalStore';

/**
 * Dispatches action to get Schedule for user
 * Differentiates between logged in user and user in search
 * @param {string} route
 * @param {string} name
 * @param {Date} startDate
 */
export const getSchedule = (route, name, startDate) => {
  // Check if this is for the currentUser or for a search
  const isForCurrentUser = globalStore.currentUser === name;
  let typeSpecifier;
  isForCurrentUser
    ? (typeSpecifier = '_FOR_USER')
    : (typeSpecifier = '_FOR_SEARCH');
  // Notifying store that schedule needs to be fetched
  dispatcher.dispatch({
    type: `GET_SCHEDULE${typeSpecifier}`,
    payload: { route, name, startDate }
  });
};

/**
 * Dispatches action to perform swipe right
 */
export const swipeRight = () => {
  dispatcher.dispatch({
    type: 'SWIPE_RIGHT'
  });
};

/**
 * Dispatches action to perform swipe left
 */
export const swipeLeft = () => {
  dispatcher.dispatch({
    type: 'SWIPE_LEFT'
  });
};

/**
 * Dispatches action to set current view day in store
 * @param {Date} targetDate
 */
export const gotoDay = targetDate => {
  dispatcher.dispatch({
    type: 'GOTO_DAY',
    payload: targetDate
  });
};

/**
 * Dispatches action to clear current search from store
 */
export const clearSearch = () => {
  dispatcher.dispatch({
    type: 'CLEAR_SEARCH'
  });
};
