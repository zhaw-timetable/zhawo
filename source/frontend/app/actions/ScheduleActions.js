import dispatcher from '../dispatcher';
import * as api from '../adapters/ZhawoAdapter';

export const getSchedule = async function(route, name, startDate) {
  // Notifying store that async functions is started -> display load spinner
  dispatcher.dispatch({
    type: 'GET_SCHEDULE_STARTED'
  });
  // Fetching for current date, for fast display of current schedule
  let schedule = await api
    .getScheduleResource(route, name, startDate, 0)
    .catch(err => {
      console.error(err);
      //TODO: maybe dispatch FAILED event here
    });
  dispatcher.dispatch({
    type: 'GET_SCHEDULE_OK',
    payload: schedule
  });
  // Notifying store that async functions is started -> display load spinner
  dispatcher.dispatch({
    type: 'GET_SCHEDULE_PRELOAD_STARTED'
  });
  // Fetching around current date, for preloading
  schedule = await api
    .getScheduleResource(route, name, startDate, 20)
    .catch(err => {
      console.error(err);
      //TODO: maybe dispatch FAILED event here
    });
  dispatcher.dispatch({
    type: 'GET_SCHEDULE_PRELOAD_OK',
    payload: schedule
  });
};

export const gotoDay = function(targetDate) {
  dispatcher.dispatch({
    type: 'GOTO_DAY',
    payload: targetDate
  });
};
