import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import NavigationMonth from './NavigationMonth';

import scheduleStore from '../../../../stores/ScheduleStore';
import * as scheduleActions from '../../../../actions/ScheduleActions';

const wrapper = shallow(<NavigationMonth />);
const instance = wrapper.instance();

beforeEach(() => {
  console.log = jest.fn();
});

it('renders without crashing', () => {});

it('should call setState with the correct value via refreshNavigation', () => {
  scheduleStore.displayDay = true;
  scheduleStore.displayWeek = false;
  scheduleStore.displayMonth = true;

  instance.setState = jest.fn();

  instance.refreshNavigation();
  expect(instance.setState).toHaveBeenCalledWith({
    displayDay: scheduleStore.displayDay,
    displayWeek: scheduleStore.displayWeek,
    displayMonth: scheduleStore.displayMonth
  });
});
