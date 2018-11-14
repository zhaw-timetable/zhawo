import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import EventDetailDialog from './EventDetailDialog';

beforeEach(() => {
  console.log = jest.fn();
});

xit('renders without crashing', () => {
  shallow(<EventDetailDialog />);
});
