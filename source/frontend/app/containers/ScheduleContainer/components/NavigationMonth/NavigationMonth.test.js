
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import NavigationMonth from './NavigationMonth';

beforeEach(() => {
  console.log = jest.fn();
});

it('renders without crashing', () => {
  shallow(<NavigationMonth />);
});

it('should render one root element with className NavigationMonth', () => {
  const wrapper = shallow(<NavigationMonth />);
  expect(wrapper.find('.NavigationMonth')).toHaveLength(1);
});
