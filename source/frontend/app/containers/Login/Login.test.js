import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import Login from './Login';

beforeEach(() => {
  console.log = jest.fn();
});

it('renders without crashing', () => {
  shallow(<Login />);
});

it('should render one root element with className Login', () => {
  const wrapper = shallow(<Login />);
  expect(wrapper.find('.Login')).toHaveLength(1);
});
