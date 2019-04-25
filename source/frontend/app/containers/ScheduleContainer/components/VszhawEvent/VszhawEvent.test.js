jest.mock('../../../../adapters/IdbAdapter');
jest.mock('../../../../adapters/ZhawoAdapter');
jest.mock('../../../../stores/GlobalStore');
jest.mock('../../../../actions/GlobalActions');
jest.mock('../../../../stores/ScheduleStore');
jest.mock('../../../../actions/ScheduleActions');
jest.mock('../../../../stores/VsZhawStore');

import vsZhawStore from '../../../../stores/VsZhawStore';

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import VszhawEvent from './VszhawEvent';

const EVENT = {
  eventName: 'Foo',
  eventDate: new Date(),
  eventUrl: 'testurl'
};

it('renders without crashing', () => {
  const wrapper = shallow(<VszhawEvent event={EVENT} />);
});

it('should render one root element with className VszhawEvent', () => {
  const wrapper = shallow(<VszhawEvent event={EVENT} />);
  expect(wrapper.find('.VszhawEvent')).toHaveLength(1);
});
