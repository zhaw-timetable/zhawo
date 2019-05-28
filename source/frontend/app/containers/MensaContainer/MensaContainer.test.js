import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import mensaStore from '../../stores/MensaStore';
import * as mensaActions from '../../actions/MensaActions';

import MensaContainer from './MensaContainer';

const wrapper = shallow(<MensaContainer />);
const instance = wrapper.instance();

jest.mock('../../stores/GlobalStore');
jest.mock('../../actions/GlobalActions');
jest.mock('../../stores/ScheduleStore');
jest.mock('../../actions/ScheduleActions');

it('renders without crashing', () => {});

it('should render one root element with className MensaContainer', () => {
  expect(wrapper.find('.MensaContainer')).toHaveLength(1);
});

it('onSwipeStart should call setState and set swipeInX to 0', () => {
  instance.setState = jest.fn();
  instance.onSwipeStart('event');
  expect(instance.setState).toHaveBeenCalledWith({ swipeInX: 0 });
});

it('onSwipeMove should call setState and set swipeInX to position parameter', () => {
  instance.setState = jest.fn();
  instance.onSwipeMove({ x: 200 }, 'event');
  expect(instance.setState).toHaveBeenCalledWith({ swipeInX: 200 });
});

it('onSwipeEnd should call mensaActions for the right direction', () => {
  mensaActions.swipeLeft = jest.fn();
  mensaActions.swipeRight = jest.fn();

  instance.state.swipeInX = global.innerWidth / 4 + 10;
  instance.onSwipeEnd('event');
  expect(mensaActions.swipeLeft).toHaveBeenCalled();

  instance.state.swipeInX = (-1 * global.innerWidth) / 4 - 10;
  instance.onSwipeEnd('event');
  expect(mensaActions.swipeRight).toHaveBeenCalled();
});
