import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';

class GlobalStore extends EventEmitter {
  constructor() {
    super();
    this.name = 'Hello World';
  }

  getName() {
    return this.name;
  }

  handleActions(action) {
    switch (action.type) {
      case 'SET_NAME':
        this.name = action.payload;
        this.emit('name_changed');
        break;
    }
  }
}

const globalStore = new GlobalStore();

dispatcher.register(globalStore.handleActions.bind(globalStore));

export default globalStore;
