import { EventEmitter } from 'events';
import { format, startOfWeek, addDays } from 'date-fns';
import dispatcher from '../dispatcher';

class TimetableStore extends EventEmitter {
  constructor() {
    super();
    this.displayDate = new Date();
    this.displayWeek = this.createDisplayWeek(this.displayDate);
    this.slots = [];
    this.timetable = {};
  }

  handleActions(action) {
    switch (action.type) {
      case 'GET_TIMETABLE_STARTED':
        break;
      case 'GET_TIMETABLE_SUCCESS':
        this.slots = action.payload.days[0].slots;
        this.timetable = this.addSlotInfoToEvents(action.payload);
        this.emit('timetable_changed');
        break;
    }
  }

  addSlotInfoToEvents(timetable) {
    timetable.days.forEach(day => {
      day.events.forEach(event => {
        event.startSlot = this.slots.findIndex(slot => {
          return slot.startTime === event.slots[0].startTime;
        });
        event.endSlot = event.startSlot + event.slots.length;
      });
    });
    return timetable;
  }

  createDisplayWeek(date) {
    const weekStartDate = startOfWeek(date, { weekStartsOn: 1 });
    const weekArray = Array.apply(null, Array(6));
    return weekArray.map((value, index) => addDays(weekStartDate, index));
  }
}

const timetableStore = new TimetableStore();

dispatcher.register(timetableStore.handleActions.bind(timetableStore));

export default timetableStore;
