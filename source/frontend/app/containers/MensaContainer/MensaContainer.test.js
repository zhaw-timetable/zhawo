import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import MensaContainer from './MensaContainer';

jest.mock('../../stores/GlobalStore');
jest.mock('../../actions/GlobalActions');
jest.mock('../../stores/ScheduleStore');
jest.mock('../../actions/ScheduleActions');

it('renders without crashing', () => {
  shallow(<MensaContainer />);
});

it('should render one root element with className MensaContainer', () => {
  const wrapper = shallow(<MensaContainer />);
  expect(wrapper.find('.MensaContainer')).toHaveLength(1);
});
