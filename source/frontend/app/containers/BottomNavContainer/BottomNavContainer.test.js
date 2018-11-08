import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import BottomNavContainer from './BottomNavContainer';

jest.mock('../../stores/GlobalStore');
jest.mock('../../actions/GlobalActions');
jest.mock('../../stores/ScheduleStore');
jest.mock('../../actions/ScheduleActions');

it('renders without crashing', () => {
  shallow(<BottomNavContainer />);
});

it('should render one root element with className BottomNavContainer', () => {
  const wrapper = shallow(<BottomNavContainer />);
  expect(wrapper.find('.BottomNavContainer')).toHaveLength(1);
});
