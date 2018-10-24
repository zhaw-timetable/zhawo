import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import Splash from './Splash';

beforeEach(() => {
  console.log = jest.fn();
});

it('renders without crashing', () => {
  shallow(<Splash />);
});

it('should render one root element with className Splash', () => {
  const wrapper = shallow(<Splash />);
  expect(wrapper.find('.Splash')).toHaveLength(1);
});
