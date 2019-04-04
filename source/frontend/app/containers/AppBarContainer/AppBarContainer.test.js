jest.mock('../..//stores/GlobalStore');
jest.mock('../../stores/ScheduleStore');
jest.mock('../../adapters/IdbAdapter');
jest.mock('../../adapters/ZhawoAdapter');

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import AppBarContainer from './AppBarContainer';

import * as globalActions from '../../actions/GlobalActions';

it('renders without crashing', () => {
  shallow(<AppBarContainer />);
});

it('should render one root element with className AppBarContainer', () => {
  const wrapper = shallow(<AppBarContainer />);
  expect(wrapper.find('.AppBarContainer')).toHaveLength(1);
});

it('should call globalActions.toggleDrawer once ', () => {
  const wrapper = shallow(<AppBarContainer />);
  const instance = wrapper.instance();
  globalActions.toggleDrawer = jest.fn();
  instance.toggleDrawer();
  expect(globalActions.toggleDrawer).toHaveBeenCalled();
});
