import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import NavigationWeek from './NavigationWeek';

const wrapper = shallow(<NavigationWeek />);
const instance = wrapper.instance();

beforeEach(() => {
  console.log = jest.fn();
});

it('renders without crashing', () => {});
