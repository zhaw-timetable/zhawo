import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import RoomSearchContainer from './RoomSearchContainer';

beforeEach(() => {
  console.log = jest.fn();
});

it('renders without crashing', () => {
  shallow(<RoomSearchContainer />);
});

it('should render one root element with className  RoomSearchContainer', () => {
  const wrapper = shallow(<RoomSearchContainer />);
  expect(wrapper.find('.RoomSearchContainer')).toHaveLength(1);
});