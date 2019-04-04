jest.mock('./adapters/IdbAdapter');
jest.mock('./stores/GlobalStore');

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import App from './App';

it('renders without crashing', () => {
  shallow(<App />);
});

it('handleThemeChanged should call forceUpdate', () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();

  instance.forceUpdate = jest.fn();
  instance.handleThemeChanged();

  expect(instance.forceUpdate).toHaveBeenCalled();

  instance.forceUpdate.mockRestore();
});

it('handleUserChange should call forceUpdate', () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();

  instance.forceUpdate = jest.fn();
  instance.handleUserChange();

  expect(instance.forceUpdate).toHaveBeenCalled();

  instance.forceUpdate.mockRestore();
});
