import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import Menu from './Menu';

it('renders without crashing', () => {
  shallow(<Menu />);
});

it('should render one root element with className Menu', () => {
  const wrapper = shallow(<Menu />);
  expect(wrapper.find('.Menu')).toHaveLength(1);
});
