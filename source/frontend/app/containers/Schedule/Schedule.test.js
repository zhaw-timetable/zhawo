import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import Schedule from './Schedule';

beforeEach(() => {
  console.log = jest.fn();
});

xit('renders without crashing', () => {
  shallow(<Schedule />);
});

xit('should render one root element with className Schedule', () => {
  const wrapper = shallow(<Schedule />);
  expect(wrapper.find('.Schedule')).toHaveLength(1);
});
