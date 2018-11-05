import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';

class GlobalStore extends EventEmitter {
  constructor() {
    super();
    this.currentUser = '';
    this.currentUserType = '';
    this.possibleNames = [];
    this.possibleLoginNames = [];
  }

  handleActions(action) {
    switch (action.type) {
      case 'SET_CURRENT_USER':
        this.currentUser = action.payload.name;
        this.currentUserType = action.payload.type;
        this.emit('current_user_changed');
        break;
      case 'GET_POSSIBLE_NAMES_OK':
        this.possibleNames = [
          ...action.payload.students,
          ...action.payload.lecturers,
          ...action.payload.classes,
          ...action.payload.courses,
          ...action.payload.rooms
        ];
        this.possibleLoginNames = [
          ...action.payload.students,
          ...action.payload.lecturers
        ];
        this.emit('possible_names_changed');
        break;
    }
  }
}

const globalStore = new GlobalStore();

dispatcher.register(globalStore.handleActions.bind(globalStore));

export default globalStore;
