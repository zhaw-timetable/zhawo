import dispatcher from '../dispatcher';

export const getAllMensas = () => {
  dispatcher.dispatch({
    type: 'GET_ALL_MENSAS'
  });
};

export const getMenuPlan = (facilityId, facilityName, date) => {
  dispatcher.dispatch({
    type: 'GET_MENUPLAN',
    payload: { facilityId, facilityName, date }
  });
};

export const swipeRight = () => {
  dispatcher.dispatch({
    type: 'MENU_SWIPE_RIGHT'
  });
};

export const swipeLeft = () => {
  dispatcher.dispatch({
    type: 'MENU_SWIPE_LEFT'
  });
};

export const gotoDay = targetDate => {
  dispatcher.dispatch({
    type: 'MENU_GOTO_DAY',
    payload: targetDate
  });
};
