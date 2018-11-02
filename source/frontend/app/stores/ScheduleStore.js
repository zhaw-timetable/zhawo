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
    // general properties
    this.currentDate = new Date();
    this.slots = defaultSlots;
    // properties for display
    this.displayDay = this.currentDate;
    this.displayWeek = this.createDisplayWeek(this.displayDay);
    this.scheduleForDisplayDay = this.findScheduleForDay(this.displayDay);
    // properties for data management
    this.schedule = null;
    this.scheduleForCurrentUser = null;
    this.scheduleForSearchUser = null;
  }

  getSearchUsername() {
    return this.searchUsername;
  }

  handleActions(action) {
    switch (action.type) {
      case 'GET_SCHEDULE_OK_FOR_CU':
        if (action.payload.days) {
          this.slots = action.payload.days[0].slots || defaultSlots;
        }
        this.schedule = this.addSlotInfoToEvents(action.payload);
        this.scheduleForDisplayDay = this.findScheduleForDay(this.displayDay);
        this.emit('schedule_changed');
        break;
      case 'GET_SCHEDULE_PRELOAD_OK_FOR_CU':
        if (action.payload.days) {
          this.slots = action.payload.days[0].slots || defaultSlots;
        }
        let extendedSchedule = this.addSlotInfoToEvents(action.payload);
        this.schedule.days = [...this.schedule.days, ...extendedSchedule.days];
        this.scheduleForDisplayDay = this.findScheduleForDay(this.displayDay);
        this.emit('schedule_changed');
        break;
      case 'GOTO_DAY':
        this.displayDay = action.payload;
        this.displayWeek = this.createDisplayWeek(this.displayDay);
        this.scheduleForDisplayDay = this.findScheduleForDay(this.displayDay);
        this.emit('schedule_changed');
        break;
    }
  }

  addSlotInfoToEvents(schedule) {
    if (schedule.days) {
      schedule.days.forEach(day => {
        day.events.forEach(event => {
          event.startSlot = this.slots.findIndex(slot => {
            return (
              getHours(slot.startTime) === getHours(event.slots[0].startTime) &&
              getMinutes(slot.startTime) ===
                getMinutes(event.slots[0].startTime)
            );
          });
          event.endSlot = event.startSlot + event.slots.length;
        });
      });
    }
    return schedule;
  }

  createDisplayWeek(date) {
    const weekStartDate = startOfWeek(date, { weekStartsOn: 1 });
    const weekArray = Array.apply(null, Array(6));
    return weekArray.map((value, index) => addDays(weekStartDate, index));
  }

  findScheduleForDay(date) {
    if (this.schedule && this.schedule.days) {
      const foundDay = this.schedule.days.find(day => {
        return isSameDay(startOfDay(day.date), startOfDay(date));
      });
      return foundDay;
    } else {
      return null;
    }
  }
}

const defaultSlots = [
  {
    endTime: '2018-10-29T08:45:00+01:00',
    startTime: '2018-10-29T08:00:00+01:00'
  },
  {
    endTime: '2018-10-29T09:35:00+01:00',
    startTime: '2018-10-29T08:50:00+01:00'
  },
  {
    endTime: '2018-10-29T10:45:00+01:00',
    startTime: '2018-10-29T10:00:00+01:00'
  },
  {
    endTime: '2018-10-29T11:35:00+01:00',
    startTime: '2018-10-29T10:50:00+01:00'
  },
  {
    endTime: '2018-10-29T12:45:00+01:00',
    startTime: '2018-10-29T12:00:00+01:00'
  },
  {
    endTime: '2018-10-29T13:35:00+01:00',
    startTime: '2018-10-29T12:50:00+01:00'
  },
  {
    endTime: '2018-10-29T14:45:00+01:00',
    startTime: '2018-10-29T14:00:00+01:00'
  },
  {
    endTime: '2018-10-29T15:35:00+01:00',
    startTime: '2018-10-29T14:50:00+01:00'
  },
  {
    endTime: '2018-10-29T16:45:00+01:00',
    startTime: '2018-10-29T16:00:00+01:00'
  },
  {
    endTime: '2018-10-29T17:35:00+01:00',
    startTime: '2018-10-29T16:50:00+01:00'
  },
  {
    endTime: '2018-10-29T18:30:00+01:00',
    startTime: '2018-10-29T17:45:00+01:00'
  },
  {
    endTime: '2018-10-29T19:25:00+01:00',
    startTime: '2018-10-29T18:40:00+01:00'
  },
  {
    endTime: '2018-10-29T20:10:00+01:00',
    startTime: '2018-10-29T19:25:00+01:00'
  },
  {
    endTime: '2018-10-29T21:05:00+01:00',
    startTime: '2018-10-29T20:20:00+01:00'
  },
  {
    endTime: '2018-10-29T21:50:00+01:00',
    startTime: '2018-10-29T21:05:00+01:00'
  }
];

const scheduleStore = new ScheduleStore();

dispatcher.register(scheduleStore.handleActions.bind(scheduleStore));

export default scheduleStore;
