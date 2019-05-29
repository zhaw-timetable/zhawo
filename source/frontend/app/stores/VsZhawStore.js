import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';

import * as api from '../adapters/ZhawoAdapter';

/**
 * Vszhaw Flux Store
 */
class VszhawStore extends EventEmitter {
  constructor() {
    super();
    this.feed = '';
    this.events = [];
  }

  /**
   * A flux action with a type and optional payload
   * @typedef {Object} FluxAction
   * @property {string} type
   * @property {Object} [payload]
   */
  /**
   * Function that is called after action is dispatched
   * Uses switch to filter actions
   * @param {FluxAction} action
   */
  async handleActions(action) {
    switch (action.type) {
      case 'GET_VSZHAWFEED':
        this.feed = await api.getVszhawFeed().catch(err => console.error(err));
        this.emit('got_vszhaw_feed');
        break;
      case 'GET_VSZHAWEVENTS':
        this.events = await api
          .getVszhawEvents()
          .catch(err => console.error(err));
        this.emit('got_vszhaw_events');
        break;
    }
  }
}

const vszhawStore = new VszhawStore();

dispatcher.register(vszhawStore.handleActions.bind(vszhawStore));

export default vszhawStore;
