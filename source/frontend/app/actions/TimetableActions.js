import { format, startOfWeek } from 'date-fns';

import dispatcher from '../dispatcher';
import * as api from '../adapters/TimetableAdapter';

//TODO: add param for resource here
export const getTimetableByUsername = async function(name, startDate) {
  dispatcher.dispatch({
    type: 'GET_TIMETABLE_STARTED'
  });
  const dateString = format(
    startOfWeek(startDate, { weekStartsOn: 1 }),
    'YYYY-MM-DD'
  );
  const response = await api.getForStudent(name, dateString);
  if (response) {
    dispatcher.dispatch({
      type: 'GET_TIMETABLE_SUCCESS',
      payload: response
    });
  } else {
    dispatcher.dispatch({
      type: 'GET_TIMETABLE_FAIL'
    });
  }
};

export const gotoDay = function(targetDate) {
  dispatcher.dispatch({
    type: 'GOTO_DAY',
    payload: targetDate
  });
};
