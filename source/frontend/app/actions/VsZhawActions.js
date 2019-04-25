import dispatcher from '../dispatcher';

export const getVszhawFeed = () => {
  dispatcher.dispatch({
    type: 'GET_VSZHAWFEED'
  });
};

export const getVszhawEvents = () => {
  dispatcher.dispatch({
    type: 'GET_VSZHAWEVENTS'
  });
};
