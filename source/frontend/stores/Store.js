import { EventEmitter } from 'events';

import dispatcher from '../dispatcher';

class Store extends EventEmitter {
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
        this.name = action.text;
        this.emit('name_changed');
        break;
    }
  }
}

const store = new Store();

dispatcher.register(store.handleActions.bind(store));

export default store;
