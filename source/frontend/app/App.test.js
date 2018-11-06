import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import App from './App';

jest.mock('./stores/GlobalStore');
jest.mock('./actions/GlobalActions');
jest.mock('./stores/ScheduleStore');
jest.mock('./actions/ScheduleActions');

it('renders without crashing', () => {
  shallow(<App />);
});
