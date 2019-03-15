import dispatcher from '../dispatcher';

import globalStore from '../stores/GlobalStore';

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

export const swipeRight = () => {
  dispatcher.dispatch({
    type: 'SWIPE_RIGHT'
  });
};

export const swipeLeft = () => {
  dispatcher.dispatch({
    type: 'SWIPE_LEFT'
  });
};

export const gotoDay = targetDate => {
  dispatcher.dispatch({
    type: 'GOTO_DAY',
    payload: targetDate
  });
};

export const clearSearch = () => {
  dispatcher.dispatch({
    type: 'CLEAR_SEARCH'
  });
};
