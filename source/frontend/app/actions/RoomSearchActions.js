import dispatcher from '../dispatcher';

export const getFreeRoomsJson = async () => {
  dispatcher.dispatch({
    type: 'GET_FREEROOMJSON'
  });
};
