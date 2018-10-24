import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import AppBar from './AppBar';

beforeEach(() => {
  console.log = jest.fn();
});

it('renders without crashing', () => {
  shallow(<AppBar />);
});

it('should render one root element with className AppBar', () => {
  const wrapper = shallow(<AppBar />);
  expect(wrapper.find('.AppBar')).toHaveLength(1);
});
