import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import Splash from './Splash';

it('renders without crashing', () => {
  shallow(<Splash />);
});

it('should render one root element with className Splash', () => {
  const wrapper = shallow(<Splash />);
  expect(wrapper.find('.Splash')).toHaveLength(1);
});
