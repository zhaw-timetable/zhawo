jest.mock('../..//stores/GlobalStore');
jest.mock('../../stores/ScheduleStore');
jest.mock('../../adapters/IdbAdapter');
jest.mock('../../adapters/ZhawoAdapter');

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import BottomNavContainer from './BottomNavContainer';

import history from '../../history';

it('renders without crashing', () => {
  shallow(<BottomNavContainer />);
});

it('should render one root element with className BottomNavContainer', () => {
  const wrapper = shallow(<BottomNavContainer />);
  expect(wrapper.find('.BottomNavContainer')).toHaveLength(1);
});

it('updateViewState should push to history with correct value', () => {
  const wrapper = shallow(<BottomNavContainer />);
  const instance = wrapper.instance();

  history.push = jest.fn();

  instance.updateViewState(null, 0);
  expect(history.push).toHaveBeenCalledWith('/');

  instance.updateViewState(null, 1);
  expect(history.push).toHaveBeenCalledWith('/mensa');

  instance.updateViewState(null, 2);
  expect(history.push).toHaveBeenCalledWith('/zhawo');

  instance.updateViewState(null, 3);
  expect(history.push).toHaveBeenCalledWith('/vszhaw');

  history.push.mockRestore();
});

it('updateViewState should call setState with correct value', () => {
  history.push = jest.fn();
  const wrapper = shallow(<BottomNavContainer />);
  const instance = wrapper.instance();
  instance.setState = jest.fn();
  instance.updateViewState(null, 0);
  let expectedArg = { value: 0 };
  expect(instance.setState).toHaveBeenCalledWith(expectedArg);
  history.push.mockRestore();
});
