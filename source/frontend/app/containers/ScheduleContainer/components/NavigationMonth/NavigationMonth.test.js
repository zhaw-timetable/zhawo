jest.mock('../../../../stores/GlobalStore');
jest.mock('../../../../stores/ScheduleStore');
jest.mock('../../../../adapters/IdbAdapter');
jest.mock('../../../../adapters/ZhawoAdapter');

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import NavigationMonth from './NavigationMonth';

import scheduleStore from '../../../../stores/ScheduleStore';
import * as scheduleActions from '../../../../actions/ScheduleActions';

const wrapper = shallow(<NavigationMonth />);
const instance = wrapper.instance();

beforeEach(() => {});

it('renders without crashing', () => {
  shallow(<NavigationMonth />);
});

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

it('should call setState on refreshNavigation', () => {
  instance.setState = jest.fn();

  scheduleStore.displayDay = '17.07.1994';
  scheduleStore.displayWeek = [1, 2, 3];
  scheduleStore.displayMonth = [1, 2, 3];
  instance.refreshNavigation();

  expect(instance.setState).toHaveBeenCalledWith({
    displayDay: '17.07.1994',
    displayWeek: [1, 2, 3],
    displayMonth: [1, 2, 3]
  });
});

it('should change month on handleMonthBackClick', () => {
  scheduleActions.gotoDay = jest.fn();

  const date = '2019-02-25T12:00:00.000Z';
  instance.state.displayDay = date;

  instance.handleMonthBackClick(null);

  expect(scheduleActions.gotoDay).toHaveBeenCalledWith(
    new Date('2019-01-06T23:00:00.000Z')
  );
});

it('should change month on handleMonthForwardClick', () => {
  scheduleActions.gotoDay = jest.fn();

  const date = '2019-02-25T12:00:00.000Z';
  instance.state.displayDay = date;

  instance.handleMonthForwardClick(null);

  expect(scheduleActions.gotoDay).toHaveBeenCalledWith(
    new Date('2019-03-03T23:00:00.000Z')
  );
});

it('should go to right day on handleclick', () => {
  scheduleActions.gotoDay = jest.fn();

  instance.handleDateClick('17.07.1994')(null);

  expect(scheduleActions.gotoDay).toHaveBeenCalledWith('17.07.1994');
});

it('should remove listeners before unmount', () => {
  scheduleStore.removeListener = jest.fn();

  wrapper.unmount();

  expect(scheduleStore.removeListener).toHaveBeenCalled();
});
