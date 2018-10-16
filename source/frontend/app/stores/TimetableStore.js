import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';

class TimetableStore extends EventEmitter {
  handleActions(action) {
    switch (action.type) {
      case 'GET_TIMETABLE_STARTED':
        break;
      case 'GET_TIMETABLE_SUCCESS':
        this.timetable = action.payload;
        this.emit('change');
        break;
    }
  }
}

const timetableStore = new TimetableStore();

dispatcher.register(timetableStore.handleActions.bind(timetableStore));

export default timetableStore;
