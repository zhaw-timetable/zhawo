// @flow

import dispatcher from '../dispatcher';
import * as timetableAdapter from '../adapters/TimetableAdapter';

export async function getTimetableByUsername(
  userName: string,
  startDate: string
) {
  dispatcher.dispatch({
    type: 'GET_TIMETABLE_STARTED'
  });
  const response = timetableAdapter.fetchByUsername(userName, startDate);
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
}
