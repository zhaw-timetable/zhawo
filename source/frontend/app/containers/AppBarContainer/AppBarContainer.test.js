import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import AppBarContainer from './AppBarContainer';

import * as globalActions from '../../actions/GlobalActions';

const wrapper = shallow(<AppBarContainer />);
const instance = wrapper.instance();

it('renders without crashing', () => {});

it('should render one root element with className AppBarContainer', () => {
  expect(wrapper.find('.AppBarContainer')).toHaveLength(1);
});

it('should call globalActions.toggleDrawer once ', () => {
  globalActions.toggleDrawer = jest.fn();
  instance.toggleDrawer();
  expect(globalActions.toggleDrawer).toHaveBeenCalled();
});
