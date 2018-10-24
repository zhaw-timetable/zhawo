import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import Profile from './Profile';

beforeEach(() => {
  console.log = jest.fn();
});

it('renders without crashing', () => {
  shallow(<Profile />);
});

it('should render one root element with className Profile', () => {
  const wrapper = shallow(<Profile />);
  expect(wrapper.find('.Profile')).toHaveLength(1);
});
