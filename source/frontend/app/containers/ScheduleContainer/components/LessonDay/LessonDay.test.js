import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import LessonDay from './LessonDay';

beforeEach(() => {
  console.log = jest.fn();
});

it('renders without crashing', () => {
  shallow(<LessonDay />);
});

it('should render one root element with className LessonMonth', () => {
  const wrapper = shallow(<LessonDay />);
  expect(wrapper.find('.LessonDay')).toHaveLength(1);
});
