// @flow

// TODO find out how to work with flow and EventEmitter. At the moment, for example this.name does not have a type.
// $FlowFixMe
import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';

type Action = {
  type: string,
  payload: any
};

class Store extends EventEmitter {
  constructor() {
    super();
    this.name = 'Hello World';
  }

  getName() {
    return this.name;
  }

  handleActions(action: Action) {
    switch (action.type) {
      case 'SET_NAME':
        this.name = action.payload;
        this.emit('name_changed');
        break;
    }
  }
}

const store = new Store();

dispatcher.register(store.handleActions.bind(store));

export default store;
