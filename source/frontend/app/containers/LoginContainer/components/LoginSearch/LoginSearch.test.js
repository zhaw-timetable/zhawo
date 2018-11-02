import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import LoginSearch from './LoginSearch';

beforeEach(() => {
  console.log = jest.fn();
});

xit('renders without crashing', () => {
  shallow(<LoginSearch />);
});

xit('should render one root element with className LoginSearch', () => {
  const wrapper = shallow(<LoginSearch />);
  expect(wrapper.find('.LoginContainer')).toHaveLength(1);
});
