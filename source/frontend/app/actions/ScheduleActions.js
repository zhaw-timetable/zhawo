import dispatcher from '../dispatcher';
import * as api from '../adapters/ZhawoAdapter';

import globalStore from '../stores/GlobalStore';

export const getSchedule = async function(route, name, startDate) {
  // Check if this is for the currentUser or for a search
  const isForCurrentUser = globalStore.currentUser === name;
  let typeSpecifier;
  isForCurrentUser
    ? (typeSpecifier = '_FOR_CU')
    : (typeSpecifier = '_FOR_SEARCH');
  // Notifying store that async functions is started -> display load spinner
  dispatcher.dispatch({
    type: `GET_SCHEDULE_STARTED${typeSpecifier}`
  });
  console.log(`GET_SCHEDULE_STARTED${typeSpecifier}`);
  // Fetching for current date, for fast display of current schedule
  let schedule = await api
    .getScheduleResource(route, name, startDate, 0)
    .catch(err => {
      console.error(err);
    });
  dispatcher.dispatch({
    type: `GET_SCHEDULE_OK${typeSpecifier}`,
    payload: schedule,
    name
  });
  console.log(`GET_SCHEDULE_OK${typeSpecifier}`);
  // Notifying store that async functions is started -> display load spinner
  // dispatcher.dispatch({
  //   type: `GET_SCHEDULE_PRELOAD_STARTED${typeSpecifier}`
  // });
  // console.log(`GET_SCHEDULE_PRELOAD_STARTED${typeSpecifier}`);
  // // Fetching around current date, for preloading
  // schedule = await api
  //   .getScheduleResource(route, name, startDate, 20)
  //   .catch(err => {
  //     console.error(err);
  //   });
  // dispatcher.dispatch({
  //   type: `GET_SCHEDULE_PRELOAD_OK${typeSpecifier}`,
  //   payload: schedule,
  //   name
  // });
  // console.log(`GET_SCHEDULE_PRELOAD_OK${typeSpecifier}`);
};

export const gotoDay = function(targetDate) {
  dispatcher.dispatch({
    type: 'GOTO_DAY',
    payload: targetDate
  });
  console.log('GOTO_DAY');
};

export const clearSearch = function() {
  dispatcher.dispatch({
    type: 'CLEAR_SEARCH'
  });
  console.log('CLEAR_SEARCH');
};
