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

import VsZhawContainer from './VsZhawContainer';

import * as vszhawActions from '../../actions/VsZhawActions';
import vszhawStore from '../../stores/VsZhawStore';

it('renders without crashing', () => {
  const wrapper = shallow(<VsZhawContainer />);
  const instance = wrapper.instance();
});

it('should render one root element with className VsZhawContainer', () => {
  const wrapper = shallow(<VsZhawContainer />);
  const instance = wrapper.instance();
  expect(wrapper.find('.VsZhawContainer')).toHaveLength(1);
});

it('should call setState with the correct value via setFeed', () => {
  const wrapper = shallow(<VsZhawContainer />);
  const instance = wrapper.instance();
  vszhawStore.feed = 'test';

  instance.setState = jest.fn();

  instance.setFeed();
  expect(instance.setState).toHaveBeenCalledWith({
    feed: 'test'
  });
});
