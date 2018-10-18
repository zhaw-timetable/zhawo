import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import VsZHAW from './VsZHAW';

it('renders without crashing', () => {
  shallow(<VsZHAW />);
});

it('should render one root element with className VsZHAW', () => {
  const wrapper = shallow(<VsZHAW />);
  expect(wrapper.find('.VsZHAW')).toHaveLength(1);
});
