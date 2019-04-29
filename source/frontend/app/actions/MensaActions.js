import dispatcher from '../dispatcher';

/**
 * Dispatches action to make API call to fetch all mensas
 */
export const getAllMensas = () => {
  dispatcher.dispatch({
    type: 'GET_ALL_MENSAS'
  });
};

/**
 * Dispatches action to get menuplan for specific facility on specific date
 * @param {string} facilityId
 * @param {string} facilityName
 * @param {string} date
 */
export const getMenuPlan = (facilityId, facilityName, date) => {
  dispatcher.dispatch({
    type: 'GET_MENUPLAN',
    payload: { facilityId, facilityName, date }
  });
};

/**
 * Dispatches action to perform swipe right
 */
export const swipeRight = () => {
  dispatcher.dispatch({
    type: 'MENU_SWIPE_RIGHT'
  });
};

/**
 * Dispatches action to perform swipe left
 */
export const swipeLeft = () => {
  dispatcher.dispatch({
    type: 'MENU_SWIPE_LEFT'
  });
};

/**
 * Dispatches action to navigate to a specific targetDate
 * @param {string} targetDate
 */
export const gotoDay = targetDate => {
  dispatcher.dispatch({
    type: 'MENU_GOTO_DAY',
    payload: targetDate
  });
};
