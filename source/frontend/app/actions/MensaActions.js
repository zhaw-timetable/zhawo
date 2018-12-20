import dispatcher from '../dispatcher';

export const getAllMensas = function() {
  dispatcher.dispatch({
    type: 'GET_ALL_MENSAS'
  });
};

export const getMenuPlan = function(facilityId, facilityName, date) {
  dispatcher.dispatch({
    type: 'GET_MENUPLAN',
    payload: { facilityId, facilityName, date }
  });
};
