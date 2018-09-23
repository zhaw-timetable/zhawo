import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import App from './App';

it('renders without crashing', () => {
  shallow(<App />);
});

it('should render one root element with className App', () => {
  const wrapper = shallow(<App />);
  expect(wrapper.find('.App')).toHaveLength(1);
});
