import dispatcher from '../dispatcher';

export const getFreeRoomsJson = () => {
  dispatcher.dispatch({
    type: 'GET_FREEROOMJSON'
  });
};

export const getFreeRoomsByTime = (start, end) => {
  dispatcher.dispatch({
    type: 'GET_FREEROOMBYTIME',
    start: start,
    end: end
  });
};

export const changeFloor = value => {
  dispatcher.dispatch({
    type: 'CHANGE_FLOOR',
    payload: value
  });
};
