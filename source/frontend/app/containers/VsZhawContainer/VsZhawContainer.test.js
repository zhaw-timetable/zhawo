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

const wrapper = shallow(<VsZhawContainer />);
const instance = wrapper.instance();

import VsZhawContainer from './VsZhawContainer';

import * as vszhawActions from '../../actions/VsZhawActions';
import vszhawStore from '../../stores/VsZhawStore';

it('renders without crashing', () => {
  const wrapper = shallow(<VsZhawContainer />);
  const instance = wrapper.instance();
});

it('should render one root element with className VsZhawContainer', () => {
  expect(wrapper.find('.VsZhawContainer')).toHaveLength(1);
});

it('should call setState with the correct value via setFeed', () => {
  vszhawStore.feed = 'test';

  instance.setState = jest.fn();

  instance.setFeed();
  expect(instance.setState).toHaveBeenCalledWith({
    feed: 'test'
  });
});

it('should remove listeners before unmount', () => {
  vszhawStore.removeListener = jest.fn();

  wrapper.unmount();

  expect(vszhawStore.removeListener).toHaveBeenCalled();
});

it('should call setState from setEvents', () => {
  vszhawStore.events = 'test';

  instance.setState = jest.fn();

  instance.setEvents();
  expect(instance.setState).toHaveBeenCalledWith({
    events: 'test'
  });
});

it('should got to link on gotoLink', () => {
  global.open = jest.fn().mockImplementationOnce(() => {
    return { focus: jest.fn() };
  });

  instance.gotoLink(null)(null);
  expect(global.open).toHaveBeenCalled();
});
