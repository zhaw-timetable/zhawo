import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import DrawerContainer from './DrawerContainer';

beforeEach(() => {
  console.log = jest.fn();
});

it('renders without crashing', () => {
  shallow(<DrawerContainer />);
});

it('should render one root element with className DrawerContainer', () => {
  const wrapper = shallow(<DrawerContainer />);
  expect(wrapper.find('.DrawerContainer')).toHaveLength(1);
});
