
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import DayViewTimetable from './DayViewTimetable';

beforeEach(() => {
  console.log = jest.fn();
});

it('renders without crashing', () => {
  shallow(<DayViewTimetable />);
});

it('should render one root element with className DayViewTimetable', () => {
  const wrapper = shallow(<DayViewTimetable />);
  expect(wrapper.find('.DayViewTimetable')).toHaveLength(1);
});
