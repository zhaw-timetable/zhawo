import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';
import idb from 'idb';

import { format } from 'date-fns';

import * as api from '../adapters/ZhawoAdapter';

class VszhawStore extends EventEmitter {
  constructor() {
    super();
    this.feed;
  }

  async handleActions(action) {
    switch (action.type) {
      case 'GET_VSZHAWFEED':
        this.feed = await api.getVszhawFeed().catch(err => {
          console.error(err);
        });

        console.log(this.feed);
        this.emit('got_vszhaw_feed');
        break;
    }
  }
}

const vszhawStore = new VszhawStore();

dispatcher.register(vszhawStore.handleActions.bind(vszhawStore));

export default vszhawStore;
