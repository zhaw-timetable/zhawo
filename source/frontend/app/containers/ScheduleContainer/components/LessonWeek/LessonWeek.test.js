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
