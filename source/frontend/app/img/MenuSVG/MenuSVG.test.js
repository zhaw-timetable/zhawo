import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import MenuSVG from './MenuSVG';

it('renders without crashing', () => {
  shallow(<MenuSVG />);
});
