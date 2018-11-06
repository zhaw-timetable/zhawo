import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import NotFoundContainer from './NotFoundContainer';

beforeEach(() => {
  console.log = jest.fn();
});

it('renders without crashing', () => {
  shallow(<NotFoundContainer />);
});

it('should render one root element with className NotFoundContainer', () => {
  const wrapper = shallow(<NotFoundContainer />);
  expect(wrapper.find('.NotFoundContainer')).toHaveLength(1);
});
