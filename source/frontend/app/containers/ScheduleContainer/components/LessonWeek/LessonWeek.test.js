import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import LessonWeek from './LessonWeek';

beforeEach(() => {
  console.log = jest.fn();
});

it('renders without crashing', () => {
  shallow(<LessonWeek />);
});

it('should render one root element with className LessonWeek', () => {
  const wrapper = shallow(<LessonWeek />);
  expect(wrapper.find('.LessonWeek')).toHaveLength(1);
});
