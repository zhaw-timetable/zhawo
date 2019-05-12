import dispatcher from '../dispatcher';

/**
 * Dispatches action to make api call to get vszhaw rss feed
 */
export const getVszhawFeed = () => {
  dispatcher.dispatch({
    type: 'GET_VSZHAWFEED'
  });
};

/**
 * Dispatches action to make api request to get next zszhaw event
 */
export const getVszhawEvents = () => {
  dispatcher.dispatch({
    type: 'GET_VSZHAWEVENTS'
  });
};
