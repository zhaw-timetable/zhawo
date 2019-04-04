jest.mock('../..//stores/GlobalStore');
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

it('should render one root element with className DrawerContainer', () => {
  const wrapper = shallow(<DrawerContainer />);
  expect(wrapper.find('.DrawerContainer')).toHaveLength(1);
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

it('should call globalActions.logout once ', () => {
  const wrapper = shallow(<DrawerContainer />);
  const instance = wrapper.instance();
  globalActions.logout = jest.fn();
  instance.logout();
  expect(globalActions.logout).toHaveBeenCalled();
});

it('should call globalActions.changeTheme with correct values ', () => {
  const wrapper = shallow(<DrawerContainer />);
  const instance = wrapper.instance();
  globalActions.changeTheme = jest.fn();
  let event = { target: { checked: true } };
  instance.handleThemeSwitchChange(event);
  expect(globalActions.changeTheme).toHaveBeenCalledWith(true);
});

it('should call globalActions.changeTheme with correct values ', () => {
  const wrapper = shallow(<DrawerContainer />);
  const instance = wrapper.instance();
  globalActions.changeTheme = jest.fn();
  let event = { target: { checked: true } };
  instance.handleThemeSwitchChange(event);
  expect(globalActions.changeTheme).toHaveBeenCalledWith(true);
});

it('should setState with correct values via handleThemeChanged ', () => {
  const wrapper = shallow(<DrawerContainer />);
  const instance = wrapper.instance();
  globalStore.drawerOpen = true;
  globalStore.theme = 'darkTheme';

  let temp = { themeSwitch: true };
  instance.setState = jest.fn();
  instance.handleThemeChanged();
  expect(instance.setState).toHaveBeenCalledWith(temp);
});

it('should setState with correct values via handleViewChanged ', () => {
  const wrapper = shallow(<DrawerContainer />);
  const instance = wrapper.instance();
  globalStore.drawerOpen = true;
  globalStore.isDayView = true;

  let temp = { viewSwitch: true };
  instance.setState = jest.fn();
  instance.handleViewChanged();
  expect(instance.setState).toHaveBeenCalledWith(temp);
});

it('should call globalActions.setDayView with correct values ', () => {
  const wrapper = shallow(<DrawerContainer />);
  const instance = wrapper.instance();
  globalActions.setDayView = jest.fn();
  let event = { target: { checked: true } };
  instance.handleViewSwitchChange(event);
  expect(globalActions.setDayView).toHaveBeenCalledWith(true);
});
