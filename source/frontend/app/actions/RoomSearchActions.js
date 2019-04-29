import dispatcher from '../dispatcher';

/**
 * Dispatches action to make API call to fetch free room data
 */
export const fetchFreeRoomData = () => {
  dispatcher.dispatch({
    type: 'FETCH_FREE_ROOM_DATA'
  });
};

/**
 * Dispatches action to get free rooms by time between parameters for
 * startTime and endTime
 * @param {string} startTime
 * @param {string} endTime
 */
export const getFreeRoomsByTime = (startTime, endTime) => {
  dispatcher.dispatch({
    type: 'GET_FREE_ROOMS_BY_TIME',
    payload: {
      startTime,
      endTime
    }
  });
};

/**
 * Dispatches action to change selected floor
 * @param {string} selectedFloor
 */
export const changeFloor = selectedFloor => {
  dispatcher.dispatch({
    type: 'CHANGE_FLOOR',
    payload: selectedFloor
  });
};
