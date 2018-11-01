import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import Timetable from './Timetable';

beforeEach(() => {
  console.log = jest.fn();
});

it('renders without crashing', () => {
  shallow(<Timetable />);
});

it('should render one root element with className Timetable', () => {
  const wrapper = shallow(<Timetable />);
  expect(wrapper.find('.Timetable')).toHaveLength(1);
});
