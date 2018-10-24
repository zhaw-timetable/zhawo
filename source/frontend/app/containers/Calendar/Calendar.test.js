import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import Calendar from './Calendar';

beforeEach(() => {
  console.log = jest.fn();
});

it('renders without crashing', () => {
  shallow(<Calendar />);
});

it('should render one root element with className Calendar', () => {
  const wrapper = shallow(<Calendar />);
  expect(wrapper.find('.Calendar')).toHaveLength(1);
});
