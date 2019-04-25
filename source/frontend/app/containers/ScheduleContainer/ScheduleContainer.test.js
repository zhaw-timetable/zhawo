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

it('renders without crashing', () => {});

it('should render one root element with className ScheduleContainer', () => {
  const wrapper = shallow(<ScheduleContainer />);
  expect(wrapper.find('.ScheduleContainer')).toHaveLength(1);
});

it('should call setState with the correct value via toggleMonthView', () => {
  const wrapper = shallow(<ScheduleContainer />);
  const instance = wrapper.instance();
  instance.state.isOpen = true;
  instance.getFreeRoomsByTime = jest.fn();
  instance.setState = jest.fn();

  instance.toggleMonthView();
  expect(instance.setState).toHaveBeenCalledWith({ isOpen: false });
});

it('should call setState with the correct value via handleView', () => {
  const wrapper = shallow(<ScheduleContainer />);
  const instance = wrapper.instance();
  globalStore.isDayView = true;
  instance.getFreeRoomsByTime = jest.fn();
  instance.setState = jest.fn();
  instance.handleView();
  expect(instance.setState).toHaveBeenCalledWith({ isDayView: true });
});

it('onSwipeStart should call setState and set swipeInX to 0', () => {
  const wrapper = shallow(<ScheduleContainer />);
  const instance = wrapper.instance();
  instance.setState = jest.fn();
  instance.onSwipeStart('event');
  expect(instance.setState).toHaveBeenCalledWith({ swipeInX: 0 });
});

it('onSwipeMove should call setState and set swipeInX to position parameter', () => {
  const wrapper = shallow(<ScheduleContainer />);
  const instance = wrapper.instance();
  instance.setState = jest.fn();
  instance.onSwipeMove({ x: 200 }, 'event');
  expect(instance.setState).toHaveBeenCalledWith({ swipeInX: 200 });
});
