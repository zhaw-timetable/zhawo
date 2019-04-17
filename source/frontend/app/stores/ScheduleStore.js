import { EventEmitter } from 'events';
import {
  format,
  startOfWeek,
  addDays,
  addWeeks,
  subWeeks,
  startOfMonth,
  getDay
} from 'date-fns';
import dispatcher from '../dispatcher';

import * as api from '../adapters/ZhawoAdapter';
import globalStore from './GlobalStore';

class ScheduleStore extends EventEmitter {
  constructor() {
    super();
    this.initializeStore();
  }

  initializeStore() {
    this.currentAction = '';
    // general properties
    this.currentDate = this.getCurrentDate();
    this.slots = defaultSlots;
    // properties for display
    this.displayDay = this.currentDate;
    this.displayWeek = this.createDisplayWeek(this.displayDay);
    this.displayMonth = this.createDisplayMonth(this.displayDay);
    this.currentSearch = '';
    // properties for data management
    this.schedule = null;
    this.scheduleForCurrentUser = null;
    this.scheduleForSearchUser = null;
  }

  clearStore() {
    this.schedule = null;
    this.scheduleForCurrentUser = null;
    this.scheduleForSearchUser = null;
    this.displayDay = this.currentDate;
    this.currentSearch = '';
    this.currentAction = '';
  }

  createDisplayWeek(date) {
    const weekStartDate = startOfWeek(date, { weekStartsOn: 1 });
    const weekArray = Array.apply(null, Array(6));
    return weekArray.map((value, index) => addDays(weekStartDate, index));
  }

  createDisplayMonth(date) {
    const monthStart = startOfMonth(date);
    var weekStartDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const monthArray = [];
    for (var i = 0; i < 5; i++) {
      monthArray[i] = this.createDisplayWeek(weekStartDate);
      weekStartDate = addDays(weekStartDate, 7);
    }
    return monthArray;
  }

  getCurrentDate() {
    return this.convertSunday(new Date());
  }

  convertSunday(date) {
    // if currentDate is Sunday, set store currentDate to the Monday after
    if (getDay(date) == 0) {
      return addDays(date, 1);
    } else {
      return date;
    }
  }

  async handleActions(action) {
    switch (action.type) {
      case 'GET_SCHEDULE_FOR_SEARCH':
      case 'GET_SCHEDULE_FOR_USER':
        let { route, name, startDate } = action.payload;
        const isForCurrentUser = globalStore.currentUser === name;
        // If this action is already running, don't run it again
        if (this.currentAction === action.type) break;
        this.currentAction = action.type;
        let fetchedSchedule = await api
          .getScheduleResource(route, name, startDate, 0)
          .catch(err => {
            console.error(err);
          });
        if (isForCurrentUser) {
          this.scheduleForCurrentUser = fetchedSchedule;
          this.schedule = this.scheduleForCurrentUser;
        } else {
          this.currentSearch = name;
          this.scheduleForSearchUser = fetchedSchedule;
          this.schedule = this.scheduleForSearchUser;
        }
        this.emit('schedule_changed');
        // Lazy load other weeks
        for (let i = 1; i < 14; i++) {
          if (this.currentAction != '') {
            try {
              let newDate = format(
                addWeeks(new Date(startDate), i),
                'YYYY-MM-DD'
              );
              let fetchedSchedule = await api
                .getScheduleResource(route, name, newDate, 0)
                .catch(err => {
                  console.error(err);
                });
              if (isForCurrentUser) {
                this.scheduleForCurrentUser.weeks = {
                  ...this.scheduleForCurrentUser.weeks,
                  ...fetchedSchedule.weeks
                };
              } else {
                this.scheduleForSearchUser.weeks = {
                  ...this.scheduleForSearchUser.weeks,
                  ...fetchedSchedule.weeks
                };
              }
            } catch (error) {
              console.log(error);
            }
          }
        }
        for (let i = 1; i < 14; i++) {
          if (this.currentAction != '') {
            try {
              let newDate = format(
                subWeeks(new Date(startDate), i),
                'YYYY-MM-DD'
              );
              let fetchedSchedule = await api.getScheduleResource(
                route,
                name,
                newDate,
                0
              );
              if (isForCurrentUser) {
                this.scheduleForCurrentUser.weeks = {
                  ...this.scheduleForCurrentUser.weeks,
                  ...fetchedSchedule.weeks
                };
              } else {
                this.scheduleForSearchUser.weeks = {
                  ...this.scheduleForSearchUser.weeks,
                  ...fetchedSchedule.weeks
                };
              }
            } catch (error) {
              console.log(error);
            }
          }
        }
        this.emit('schedule_changed');
        this.currentAction = '';
        break;

      case 'GOTO_DAY':
        this.displayDay = this.convertSunday(action.payload);
        this.displayWeek = this.createDisplayWeek(this.displayDay);
        this.displayMonth = this.createDisplayMonth(this.displayDay);
        this.emit('schedule_changed');
        break;

      case 'CLEAR_SEARCH':
        this.schedule = this.scheduleForCurrentUser;
        this.currentSearch = '';
        this.emit('schedule_changed');
        break;

      case 'SWIPE_RIGHT':
        if (globalStore.isDayView) {
          this.displayDay = this.convertSunday(addDays(this.displayDay, 1));
        } else {
          this.displayDay = this.convertSunday(addDays(this.displayDay, 7));
        }
        this.displayWeek = this.createDisplayWeek(this.displayDay);
        this.displayMonth = this.createDisplayMonth(this.displayDay);
        this.emit('schedule_changed');
        break;

      case 'SWIPE_LEFT':
        if (globalStore.isDayView) {
          // If going back from Monday, need to subtract 2 days since Sundays are not displayed
          let daysToSubtract;
          if (getDay(this.displayDay) == 1) {
            daysToSubtract = 2;
          } else {
            daysToSubtract = 1;
          }
          this.displayDay = this.convertSunday(
            addDays(this.displayDay, -daysToSubtract)
          );
        } else {
          this.displayDay = this.convertSunday(addDays(this.displayDay, -7));
        }
        this.displayWeek = this.createDisplayWeek(this.displayDay);
        this.displayMonth = this.createDisplayMonth(this.displayDay);
        this.emit('schedule_changed');
        break;

      case 'LOGOUT':
        this.clearStore();
        break;
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
