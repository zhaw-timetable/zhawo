import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';

class GlobalStore extends EventEmitter {
  constructor() {
    super();
    this.name = 'Hello World';
    this.username = 'vissejul';
  }

  getName() {
    return this.name;
  }

  getUsername() {
    return this.username;
  }

  handleActions(action) {
    switch (action.type) {
      case 'SET_NAME':
        this.name = action.payload;
        this.emit('name_changed');
        break;
      case 'SET_USERNAME':
        this.name = action.payload;
        this.emit('username_changed');
        break;
    }
  }
}

const globalStore = new GlobalStore();

dispatcher.register(globalStore.handleActions.bind(globalStore));

export default globalStore;
