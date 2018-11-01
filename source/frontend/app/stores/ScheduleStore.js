import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';

import {
  startOfWeek,
  addDays,
  isSameDay,
  startOfDay,
  getHours,
  getMinutes
} from 'date-fns';

class ScheduleStore extends EventEmitter {
  constructor() {
    super();
    this.displayDate = addDays(new Date(), 0);
    this.displayWeek = this.createDisplayWeek(this.displayDate);
    this.slots = [];
    this.schedule = null;
    this.scheduleDisplayDate = this.findScheduleForDate(this.displayDate);
  }

  getSearchUsername() {
    return this.searchUsername;
  }

  handleActions(action) {
    switch (action.type) {
      case 'GET_SCHEDULE_OK':
        this.slots = action.payload.days[0].slots;
        this.schedule = this.addSlotInfoToEvents(action.payload);
        this.scheduleDisplayDate = this.findScheduleForDate(this.displayDate);
        this.emit('timetable_changed');
        break;
      case 'GOTO_DAY':
        this.displayDate = action.payload;
        this.displayWeek = this.createDisplayWeek(this.displayDate);
        this.scheduleDisplayDate = this.findScheduleForDate(this.displayDate);
        this.emit('timetable_changed');
        break;
    }
  }

  addSlotInfoToEvents(schedule) {
    schedule.days.forEach(day => {
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
    return schedule;
  }

  createDisplayWeek(date) {
    const weekStartDate = startOfWeek(date, { weekStartsOn: 1 });
    const weekArray = Array.apply(null, Array(6));
    return weekArray.map((value, index) => addDays(weekStartDate, index));
  }

  findScheduleForDate(date) {
    if (this.schedule) {
      const foundDay = this.schedule.days.find(day => {
        return isSameDay(startOfDay(day.date), startOfDay(date));
      });
      return foundDay;
    } else {
      return null;
    }
  }
}

const scheduleStore = new ScheduleStore();

dispatcher.register(scheduleStore.handleActions.bind(scheduleStore));

export default scheduleStore;
