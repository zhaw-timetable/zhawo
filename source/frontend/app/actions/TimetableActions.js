// @flow

import dispatcher from '../dispatcher';
import * as timetableAdapter from '../adapters/TimetableAdapter';

export const getTimetableByUsername = async function(
  userName: string,
  startDate: string
) {
  dispatcher.dispatch({
    type: 'GET_TIMETABLE_STARTED'
  });
  const response = await timetableAdapter.fetchByUsername(userName, startDate);
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
