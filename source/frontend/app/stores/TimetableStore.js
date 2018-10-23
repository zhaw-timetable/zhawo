import { EventEmitter } from 'events';
import {
  format,
  startOfWeek,
  addDays,
  isSameDay,
  startOfDay,
  getHours,
  getMinutes
} from 'date-fns';
import dispatcher from '../dispatcher';

class TimetableStore extends EventEmitter {
  constructor() {
    super();
    this.displayDate = addDays(new Date(), 0);
    this.displayWeek = this.createDisplayWeek(this.displayDate);
    this.slots = [];
    this.timetable = null;
    this.timetableDisplayDate = this.findTimetableForDate(this.displayDate);
    this.searchUsername = '';
  }

  getSearchUsername() {
    return this.searchUsername;
  }

  handleActions(action) {
    switch (action.type) {
      case 'GET_TIMETABLE_STARTED':
        break;
      case 'GET_TIMETABLE_SUCCESS':
        this.slots = action.payload.days[0].slots;
        this.timetable = this.addSlotInfoToEvents(action.payload);
        this.timetableDisplayDate = this.findTimetableForDate(this.displayDate);
        this.emit('timetable_changed');
        break;
      case 'GOTO_DAY':
        this.displayDate = action.payload;
        this.displayWeek = this.createDisplayWeek(this.displayDate);
        this.timetableDisplayDate = this.findTimetableForDate(this.displayDate);
        this.emit('timetable_changed');
        break;
    }
  }

  addSlotInfoToEvents(timetable) {
    timetable.days.forEach(day => {
      day.events.forEach(event => {
        event.startSlot = this.slots.findIndex(slot => {
          return (
            getHours(slot.startTime) === getHours(event.slots[0].startTime) &&
            getMinutes(slot.startTime) === getMinutes(event.slots[0].startTime)
          );
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

  findTimetableForDate(date) {
    if (this.timetable) {
      const foundDay = this.timetable.days.find(day => {
        return isSameDay(startOfDay(day.date), startOfDay(date));
      });
      return foundDay;
    } else {
      return null;
    }
  }
}

const timetableStore = new TimetableStore();

dispatcher.register(timetableStore.handleActions.bind(timetableStore));

export default timetableStore;
