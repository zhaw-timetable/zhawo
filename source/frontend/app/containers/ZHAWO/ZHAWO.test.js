import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import ZHAWO from './ZHAWO';

it('renders without crashing', () => {
  shallow(<ZHAWO />);
});

it('should render one root element with className ZHAWO', () => {
  const wrapper = shallow(<ZHAWO />);
  expect(wrapper.find('.ZHAWO')).toHaveLength(1);
});
