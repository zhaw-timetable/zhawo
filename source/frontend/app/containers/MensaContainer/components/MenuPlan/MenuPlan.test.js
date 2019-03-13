import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import MenuPlan from './MenuPlan';

const wrapper = shallow(<MenuPlan />);
const instance = wrapper.instance();

it('renders without crashing', () => {});

it('should render one root element with className MenuPlan', () => {
  expect(wrapper.find('.MenuPlan')).toHaveLength(1);
});
