import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import NotFound from './NotFound';

it('renders without crashing', () => {
  shallow(<NotFound />);
});

it('should render one root element with className NotFound', () => {
  const wrapper = shallow(<NotFound />);
  expect(wrapper.find('.NotFound')).toHaveLength(1);
});
