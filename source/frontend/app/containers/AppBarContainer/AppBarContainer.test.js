import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import AppBarContainer from './AppBarContainer';

jest.mock('../../stores/GlobalStore');
jest.mock('../../actions/GlobalActions');
jest.mock('../../stores/ScheduleStore');
jest.mock('../../actions/ScheduleActions');

it('renders without crashing', () => {
  shallow(<AppBarContainer />);
});

it('should render one root element with className AppBarContainer', () => {
  const wrapper = shallow(<AppBarContainer />);
  expect(wrapper.find('.AppBarContainer')).toHaveLength(1);
});
