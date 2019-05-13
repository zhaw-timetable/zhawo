jest.mock('../../../stores/GlobalStore');
jest.mock('../../../stores/ScheduleStore');
jest.mock('../../../adapters/IdbAdapter');
jest.mock('../../../adapters/ZhawoAdapter');

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import DrawerNav from './DrawerNav';

import history from '../../../history';

it('renders without crashing', () => {
  shallow(<DrawerNav />);
});

it('should render one root element with className DrawerNav', () => {
  const wrapper = shallow(<DrawerNav />);
  expect(wrapper.find('.DrawerNav')).toHaveLength(1);
});

it('updateViewState should push to history with correct value', () => {
  const wrapper = shallow(<DrawerNav />);
  const instance = wrapper.instance();

  history.push = jest.fn();

  instance.updateViewState(0);
  expect(history.push).toHaveBeenCalledWith('/');

  instance.updateViewState(1);
  expect(history.push).toHaveBeenCalledWith('/mensa');

  instance.updateViewState(2);
  expect(history.push).toHaveBeenCalledWith('/zhawo');

  instance.updateViewState(3);
  expect(history.push).toHaveBeenCalledWith('/vszhaw');

  history.push.mockRestore();
});

it('updateViewState should call setState with correct value', () => {
  history.push = jest.fn();
  const wrapper = shallow(<DrawerNav />);
  const instance = wrapper.instance();
  instance.setState = jest.fn();
  instance.updateViewState(0);
  let expectedArg = { value: 0 };
  expect(instance.setState).toHaveBeenCalledWith(expectedArg);
  history.push.mockRestore();
});
