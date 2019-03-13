import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import MensaNavigationWeek from './MensaNavigationWeek';

const wrapper = shallow(<MensaNavigationWeek />);
const instance = wrapper.instance();

beforeEach(() => {
  console.log = jest.fn();
});

it('renders without crashing', () => {});
