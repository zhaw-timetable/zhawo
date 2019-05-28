jest.mock('./adapters/IdbAdapter');
jest.mock('./stores/GlobalStore');

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

import globalStore from './stores/GlobalStore';

configure({ adapter: new Adapter() });

import App from './App';

const wrapper = shallow(<App />);
const instance = wrapper.instance();

it('renders without crashing', () => {
  shallow(<App />);
});

it('handleThemeChanged should call forceUpdate', () => {
  instance.forceUpdate = jest.fn();
  instance.handleThemeChanged();

  expect(instance.forceUpdate).toHaveBeenCalled();

  instance.forceUpdate.mockRestore();
});

it('handleUserChange should call forceUpdate', () => {
  instance.forceUpdate = jest.fn();
  instance.handleUserChange();

  expect(instance.forceUpdate).toHaveBeenCalled();

  instance.forceUpdate.mockRestore();
});

it('should remove listeners before unmount', () => {
  globalStore.removeListener = jest.fn();

  wrapper.unmount();

  expect(globalStore.removeListener).toHaveBeenCalled();
});
