import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import LoginContainer from './LoginContainer';

beforeEach(() => {
  console.log = jest.fn();
});

it('renders without crashing', () => {
  shallow(<LoginContainer />);
});

it('should render one root element with className LoginContainer', () => {
  const wrapper = shallow(<LoginContainer />);
  expect(wrapper.find('.LoginContainer')).toHaveLength(1);
});