import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import LoginContainer from './LoginContainer';

const wrapper = shallow(<LoginContainer />);
const instance = wrapper.instance();

jest.mock('../../stores/GlobalStore');
jest.mock('../../actions/GlobalActions');
jest.mock('../../stores/ScheduleStore');
jest.mock('../../actions/ScheduleActions');

it('renders without crashing', () => {});

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
