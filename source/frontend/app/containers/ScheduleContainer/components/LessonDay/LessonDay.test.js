import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

import { format } from 'date-fns';

configure({ adapter: new Adapter() });

import LessonDay from './LessonDay';

import scheduleStore from '../../../../stores/ScheduleStore';
import * as scheduleActions from '../../../../actions/ScheduleActions';

const wrapper = shallow(<LessonDay />);
const instance = wrapper.instance();

beforeEach(() => {
  console.log = jest.fn();
});

it('renders without crashing', () => {});

it('should call setState with the correct value via refreshSchedule', () => {
  scheduleStore.displayDay = true;
  scheduleStore.schedule = [1, 2, 3];

  instance.setState = jest.fn();

  instance.refreshSchedule();
  expect(instance.setState).toHaveBeenCalledWith({
    displayDay: scheduleStore.displayDay,
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
