import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import App from './App';

const wrapper = shallow(<App />);
const instance = wrapper.instance();

it('renders without crashing', () => {});

it('should call setState with the correct value via handleThemeChanged', () => {
  instance.setState = jest.fn();

  instance.handleThemeChanged();
  expect(instance.setState).toHaveBeenCalledWith({
    theme: 'lightTheme'
  });
});
