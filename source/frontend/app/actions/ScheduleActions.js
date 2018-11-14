import dispatcher from '../dispatcher';

import globalStore from '../stores/GlobalStore';

export const getSchedule = async function(route, name, startDate) {
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

export const gotoDay = function(targetDate) {
  dispatcher.dispatch({
    type: 'GOTO_DAY',
    payload: targetDate
  });
};

export const clearSearch = function() {
  dispatcher.dispatch({
    type: 'CLEAR_SEARCH'
  });
};
