import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import VsZhawContainer from './VsZhawContainer';

jest.mock('../../stores/GlobalStore');
jest.mock('../../actions/GlobalActions');
jest.mock('../../stores/ScheduleStore');
jest.mock('../../actions/ScheduleActions');

it('renders without crashing', () => {
  shallow(<VsZhawContainer />);
});

it('should render one root element with className VsZhawContainer', () => {
  const wrapper = shallow(<VsZhawContainer />);
  expect(wrapper.find('.VsZhawContainer')).toHaveLength(1);
});
