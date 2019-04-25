import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';

import * as api from '../adapters/ZhawoAdapter';

class VszhawStore extends EventEmitter {
  constructor() {
    super();
    this.feed = '';
    this.events = [];
  }

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
        this.events[0].eventDate =
          this.events[0].eventDate.substring(
            0,
            this.events[0].eventDate.length - 1
          ) + '+01:00';
        console.log(this.events);
        this.emit('got_vszhaw_events');
        break;
    }
  }
}

const vszhawStore = new VszhawStore();

dispatcher.register(vszhawStore.handleActions.bind(vszhawStore));

export default vszhawStore;
