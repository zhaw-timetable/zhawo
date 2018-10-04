import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import Timebar from './Timebar';

it('renders without crashing', () => {
  shallow(<Timebar />);
});

it('should render one root element with className Timebar', () => {
  const wrapper = shallow(<Timebar />);
  expect(wrapper.find('.Timebar')).toHaveLength(1);
});
