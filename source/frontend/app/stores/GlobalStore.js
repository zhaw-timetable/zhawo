import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';

class GlobalStore extends EventEmitter {
  constructor() {
    super();
    this.username = '';
  }

  getUsername() {
    return this.username;
  }

  setUsername(username) {
    this.username = username;
  }

  handleActions(action) {
    switch (action.type) {
      case 'SET_NAME':
        this.name = action.payload;
        this.emit('name_changed');
        break;
      case 'SET_USERNAME':
        this.setUsername(action.payload);
        this.emit('username_changed');
        break;
    }
  }
}

const globalStore = new GlobalStore();

dispatcher.register(globalStore.handleActions.bind(globalStore));

export default globalStore;
