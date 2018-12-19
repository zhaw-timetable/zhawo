import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import BottomNavContainer from './BottomNavContainer';

import history from '../../history';

const wrapper = shallow(<BottomNavContainer />);
const instance = wrapper.instance();

it('renders without crashing', () => {});

it('should render one root element with className BottomNavContainer', () => {
  expect(wrapper.find('.BottomNavContainer')).toHaveLength(1);
});

it('should call handleChange with the correct value', () => {
  history.push = jest.fn();

  instance.handleChange(null, 0);
  expect(history.push).toHaveBeenCalledWith('/');

  instance.handleChange(null, 1);
  expect(history.push).toHaveBeenCalledWith('/mensa');

  instance.handleChange(null, 2);
  expect(history.push).toHaveBeenCalledWith('/zhawo');

  instance.handleChange(null, 3);
  expect(history.push).toHaveBeenCalledWith('/vszhaw');
});

it('should call setState with the correct value via handleChange', () => {
  instance.setState = jest.fn();
  instance.handleChange(null, 0);
  let temp = { value: 0 };
  expect(instance.setState).toHaveBeenCalledWith(temp);
});
