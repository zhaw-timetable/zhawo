import { format, startOfWeek } from 'date-fns';

import dispatcher from '../dispatcher';
import * as timetableAdapter from '../adapters/TimetableAdapter';

export const getTimetableByUsername = async function(userName, startDate) {
  dispatcher.dispatch({
    type: 'GET_TIMETABLE_STARTED'
  });
  const formattedDate = format(
    startOfWeek(startDate, { weekStartsOn: 1 }),
    'YYYY-MM-DD'
  );
  const response = await timetableAdapter.fetchByUsername(
    userName,
    formattedDate
  );
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
