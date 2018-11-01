import dispatcher from '../dispatcher';
import * as api from '../adapters/ZhawoAdapter';

export const getSchedule = async function(route, name, startDate) {
  const schedule = await api.getScheduleResource(route, name, startDate);
  schedule &&
    dispatcher.dispatch({
      type: 'GET_SCHEDULE_OK',
      payload: schedule
    });
};

export const gotoDay = function(targetDate) {
  dispatcher.dispatch({
    type: 'GOTO_DAY',
    payload: targetDate
  });
};
