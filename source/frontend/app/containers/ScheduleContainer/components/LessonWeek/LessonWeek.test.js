import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import scheduleStore from '../../../../stores/ScheduleStore';
import globalStore from '../../../../stores/GlobalStore.js';

import LessonWeek from './LessonWeek';

const wrapper = shallow(<LessonWeek />);
const instance = wrapper.instance();

beforeEach(() => {
  console.log = jest.fn();
});

it('renders without crashing', () => {});

it('should call setState with the correct value via refreshSchedule', () => {
  scheduleStore.slots = [1, 2, 3];
  scheduleStore.displayDay = true;
  scheduleStore.schedule = [1, 2, 3];
  globalStore.isDayView = true;
  instance.getFreeRoomsByTime = jest.fn();
  instance.setState = jest.fn();

  instance.refreshSchedule();
  expect(instance.setState).toHaveBeenCalledWith({
    slots: [1, 2, 3],
    displayDay: true,
    schedule: [1, 2, 3]
  });
});

it('should call setState with the correct value via handleCloseEventDetails', () => {
  instance.setState = jest.fn();

  instance.handleCloseEventDetails();
  expect(instance.setState).toHaveBeenCalledWith({
    eventDetailsOpen: false,
    eventForDetails: null
  });
});
