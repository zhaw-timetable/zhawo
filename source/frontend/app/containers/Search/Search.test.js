import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import Search from './Search';

it('renders without crashing', () => {
  shallow(<Search />);
});

it('should render one root element with className Search', () => {
  const wrapper = shallow(<Search />);
  expect(wrapper.find('.Search')).toHaveLength(1);
});
