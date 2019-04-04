jest.mock('../../../../stores/GlobalStore');
jest.mock('../../../../stores/ScheduleStore');
jest.mock('../../../../adapters/IdbAdapter');
jest.mock('../../../../adapters/ZhawoAdapter');

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import LessonDay from './LessonDay';

import scheduleStore from '../../../../stores/ScheduleStore';
import * as scheduleActions from '../../../../actions/ScheduleActions';

const wrapper = shallow(<LessonDay />);
const instance = wrapper.instance();

beforeEach(() => {});

it('renders without crashing', () => {
  shallow(<LessonDay />);
});

it('should call setState with the correct value via refreshSchedule', () => {
  const wrapper = shallow(<LessonDay />);
  const instance = wrapper.instance();
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
  const wrapper = shallow(<LessonDay />);
  const instance = wrapper.instance();
  instance.setState = jest.fn();

  instance.handleCloseEventDetails();
  expect(instance.setState).toHaveBeenCalledWith({
    eventDetailsOpen: false,
    eventForDetails: null
  });
});
