jest.mock('../../stores/GlobalStore');
jest.mock('../../actions/GlobalActions');

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import LoginContainer from './LoginContainer';
import globalStore from '../../stores/GlobalStore';

const wrapper = shallow(<LoginContainer />);
const instance = wrapper.instance();

it('renders without crashing', () => {
  shallow(<LoginContainer />);
});

it('should render one root element with className LoginContainer', () => {
  expect(wrapper.find('.LoginContainer')).toHaveLength(1);
});

it('should call handleUsernameInputChange with correct values ', () => {
  instance.setState = jest.fn();
  let event = { target: { value: 'test' } };
  instance.handleUsernameInputChange(event);
  expect(instance.setState).toHaveBeenCalledWith({ input: 'test' });
});

it('should call login with correct values ', () => {
  instance.setState = jest.fn();
  instance.login();
  expect(instance.setState).toHaveBeenCalledWith({
    redirectToPreviousRoute: true
  });
});

it('getCurrentViewPath should set history with correct value from globalStore', () => {
  let tempReturn;
  globalStore.viewState = 0;
  tempReturn = instance.getCurrentViewPath();
  expect(tempReturn).toEqual('/');

  globalStore.viewState = 1;
  tempReturn = instance.getCurrentViewPath();
  expect(tempReturn).toEqual('/mensa');

  globalStore.viewState = 2;
  tempReturn = instance.getCurrentViewPath();
  expect(tempReturn).toEqual('/zhawo');

  globalStore.viewState = 3;
  tempReturn = instance.getCurrentViewPath();
  expect(tempReturn).toEqual('/vszhaw');
});

it('getCurrentViewPath should set default value from globalStore', () => {
  let tempReturn;
  globalStore.viewState = 4;
  tempReturn = instance.getCurrentViewPath();
  expect(tempReturn).toEqual('/');

  tempReturn = instance.getCurrentViewPath();
  expect(tempReturn).toEqual('/');
});

it('should remove listeners before unmount', () => {
  globalStore.removeListener = jest.fn();

  wrapper.unmount();

  expect(globalStore.removeListener).toHaveBeenCalled();
});
