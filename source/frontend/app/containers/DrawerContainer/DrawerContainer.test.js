jest.mock('../../stores/GlobalStore');
jest.mock('../../stores/ScheduleStore');
jest.mock('../../adapters/IdbAdapter');
jest.mock('../../adapters/ZhawoAdapter');

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import DrawerContainer from './DrawerContainer';

import * as globalActions from '../../actions/GlobalActions';
import globalStore from '../../stores/GlobalStore';

const wrapper = shallow(<DrawerContainer />);
const instance = wrapper.instance();

beforeEach(() => {});

it('renders without crashing', () => {
  shallow(<DrawerContainer />);
});

it('should call globalActions.toggleDrawer once ', () => {
  const wrapper = shallow(<DrawerContainer />);
  const instance = wrapper.instance();
  globalActions.toggleDrawer = jest.fn();
  instance.toggleDrawer();
  expect(globalActions.toggleDrawer).toHaveBeenCalled();
});

it('should call setState with the correct value via handleDrawer', () => {
  const wrapper = shallow(<DrawerContainer />);
  const instance = wrapper.instance();
  instance.setState = jest.fn();
  globalStore.drawerOpen = jest.fn(true);

  instance.handleDrawer();

  expect(instance.setState).toHaveBeenCalledWith({
    drawerOpen: globalStore.drawerOpen
  });

  expect(globalActions.toggleDrawer).toHaveBeenCalled();
});
