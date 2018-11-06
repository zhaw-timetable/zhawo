import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

jest.mock('../../../../actions/GlobalActions');

import LoginSearch from './LoginSearch';

beforeEach(() => {
  console.log = jest.fn();
});

it('renders without crashing', () => {
  shallow(<LoginSearch />);
});

it('should render one root element with className LoginSearch', () => {
  const wrapper = shallow(<LoginSearch />);
  expect(wrapper.find('.LoginSearch')).toHaveLength(1);
});
