jest.mock('../../stores/GlobalStore');
jest.mock('../../stores/ScheduleStore');
jest.mock('../../stores/VsZhawStore');
jest.mock('../../adapters/IdbAdapter');
jest.mock('../../adapters/ZhawoAdapter');

import globalStore from '../../stores/GlobalStore';
import * as scheduleActions from '../../actions/ScheduleActions';

import ScheduleContainer from './ScheduleContainer';

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

const wrapper = shallow(<ScheduleContainer />);
const instance = wrapper.instance();

it('renders without crashing', () => {});

it('should render one root element with className ScheduleContainer', () => {
  expect(wrapper.find('.ScheduleContainer')).toHaveLength(1);
});

it('should call setState with the correct value via toggleMonthView', () => {
  instance.state.isOpen = true;
  instance.getFreeRoomsByTime = jest.fn();
  instance.setState = jest.fn();

  instance.toggleMonthView();
  expect(instance.setState).toHaveBeenCalledWith({ isOpen: false });
});

it('should call setState with the correct value via handleView', () => {
  globalStore.isDayView = true;
  instance.getFreeRoomsByTime = jest.fn();
  instance.setState = jest.fn();
  instance.handleView();
  expect(instance.setState).toHaveBeenCalledWith({ isDayView: true });
});

it('onSwipeStart should call setState and set swipeInX to 0', () => {
  instance.setState = jest.fn();
  instance.onSwipeStart('event');
  expect(instance.setState).toHaveBeenCalledWith({ swipeInX: 0 });
});

it('onSwipeMove should call setState and set swipeInX to position parameter', () => {
  instance.setState = jest.fn();
  instance.onSwipeMove({ x: 200 }, 'event');
  expect(instance.setState).toHaveBeenCalledWith({ swipeInX: 200 });
});

it('should remove listeners before unmount', () => {
  globalStore.removeListener = jest.fn();

  wrapper.unmount();

  expect(globalStore.removeListener).toHaveBeenCalled();
});

it('onSwipeEnd should call mensaActions for the right direction', () => {
  scheduleActions.swipeLeft = jest.fn();
  scheduleActions.swipeRight = jest.fn();

  instance.state.swipeInX = global.innerWidth / 4 + 10;
  instance.onSwipeEnd('event');
  expect(scheduleActions.swipeLeft).toHaveBeenCalled();

  instance.state.swipeInX = (-1 * global.innerWidth) / 4 - 10;
  instance.onSwipeEnd('event');
  expect(scheduleActions.swipeRight).toHaveBeenCalled();
});
