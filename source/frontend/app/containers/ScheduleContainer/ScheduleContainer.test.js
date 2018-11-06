import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import ScheduleContainer from './ScheduleContainer';

jest.mock('../../stores/GlobalStore');
jest.mock('../../actions/GlobalActions');
jest.mock('../../stores/ScheduleStore');
jest.mock('../../actions/ScheduleActions');

it('renders without crashing', () => {
  shallow(<ScheduleContainer />);
});

it('should render one root element with className ScheduleContainer', () => {
  const wrapper = shallow(<ScheduleContainer />);
  expect(wrapper.find('.ScheduleContainer')).toHaveLength(1);
});
