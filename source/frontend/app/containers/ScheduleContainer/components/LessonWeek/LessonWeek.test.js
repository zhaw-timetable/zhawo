jest.mock('../../../../stores/GlobalStore');
jest.mock('../../../../stores/ScheduleStore');
jest.mock('../../../../adapters/IdbAdapter');
jest.mock('../../../../adapters/ZhawoAdapter');

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

const wrapper = shallow(<LessonWeek />);
const instance = wrapper.instance();

import scheduleStore from '../../../../stores/ScheduleStore';
import globalStore from '../../../../stores/GlobalStore.js';
import vszhawStore from '../../../../stores/VsZhawStore';

import LessonWeek from './LessonWeek';

beforeEach(() => {});

it('renders without crashing', () => {
  shallow(<LessonWeek />);
});

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

it('should remove listeners before unmount', () => {
  scheduleStore.removeListener = jest.fn();
  vszhawStore.removeListener = jest.fn();
  wrapper.unmount();

  expect(scheduleStore.removeListener).toHaveBeenCalled();
  expect(vszhawStore.removeListener).toHaveBeenCalled();
});

it('should call setState from setEvents', () => {
  vszhawStore.events = 'test';

  instance.setState = jest.fn();

  instance.setEvents();
  expect(instance.setState).toHaveBeenCalledWith({
    vszhawEvents: 'test'
  });
});
