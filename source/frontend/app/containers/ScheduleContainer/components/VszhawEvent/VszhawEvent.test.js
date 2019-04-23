jest.mock('../../adapters/IdbAdapter');
jest.mock('../../adapters/ZhawoAdapter');
jest.mock('../../stores/GlobalStore');
jest.mock('../../actions/GlobalActions');
jest.mock('../../stores/ScheduleStore');
jest.mock('../../actions/ScheduleActions');
jest.mock('../../stores/VsZhawStore');

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import VszhawEvent from './VszhawEvent';

it('renders without crashing', () => {
  const wrapper = shallow(<VszhawEvent />);
});

it('should render one root element with className VszhawEvent', () => {
  const wrapper = shallow(<VszhawEvent />);
  expect(wrapper.find('.VszhawEvent')).toHaveLength(1);
});
