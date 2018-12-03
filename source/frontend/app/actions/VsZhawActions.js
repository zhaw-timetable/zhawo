import dispatcher from '../dispatcher';

export const getVszhawFeed = async () => {
  dispatcher.dispatch({
    type: 'GET_VSZHAWFEED'
  });
};
