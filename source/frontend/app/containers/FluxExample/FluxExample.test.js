import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import FluxExample from './FluxExample';

it('renders without crashing', () => {
  shallow(<FluxExample />);
});

it('should render one root element with className FluxExample', () => {
  const wrapper = shallow(<FluxExample />);
  expect(wrapper.find('.FluxExample')).toHaveLength(1);
});
