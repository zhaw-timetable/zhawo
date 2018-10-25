import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import ZHAWOSVG from './ZHAWOSVG';

it('renders without crashing', () => {
  shallow(<ZHWOSVG />);
});
