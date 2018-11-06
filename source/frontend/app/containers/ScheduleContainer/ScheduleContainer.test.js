import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import ScheduleContainer from './ScheduleContainer';

beforeEach(() => {
  console.log = jest.fn();
});

xit('renders without crashing', () => {
  shallow(<ScheduleContainer />);
});

xit('should render one root element with className ScheduleContainer', () => {
  const wrapper = shallow(<ScheduleContainer />);
  expect(wrapper.find('.ScheduleContainer')).toHaveLength(1);
});
