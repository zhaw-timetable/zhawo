import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import Nav from './Nav';

it('renders without crashing', () => {
  shallow(<Nav />);
});

it('should render one root element with className Nav', () => {
  const wrapper = shallow(<Nav />);
  expect(wrapper.find('.Nav')).toHaveLength(1);
});
