import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import VsZhawContainer from './VsZhawContainer';

import * as vszhawActions from '../../actions/VsZhawActions';
import vszhawStore from '../../stores/VsZhawStore';

const wrapper = shallow(<VsZhawContainer />);
const instance = wrapper.instance();

it('renders without crashing', () => {});

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
