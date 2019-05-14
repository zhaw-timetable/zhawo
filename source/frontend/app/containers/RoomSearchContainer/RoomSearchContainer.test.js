jest.mock('../../adapters/IdbAdapter');
jest.mock('../../adapters/ZhawoAdapter');
jest.mock('../../stores/GlobalStore');
jest.mock('../../actions/GlobalActions');
jest.mock('../../stores/ScheduleStore');
jest.mock('../../actions/ScheduleActions');
jest.mock('../../stores/RoomSearchStore');

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

const wrapper = shallow(<RoomSearchContainer />);
const instance = wrapper.instance();

import roomSearchStore from '../../stores/RoomSearchStore';
import * as roomSearchActions from '../../actions/RoomSearchActions';

import RoomSearchContainer from './RoomSearchContainer';

it('renders without crashing', () => {
  shallow(<RoomSearchContainer />);
});

it('should render one root element with className  RoomSearchContainer', () => {
  expect(wrapper.find('.RoomSearchContainer')).toHaveLength(1);
});

xit('should call setState via setFreeRooms with correct values ', () => {
  roomSearchStore.currentfreeRooms = [1, 2, 3];
  roomSearchStore.currentTimeSlot = '00:00';
  instance.setState = jest.fn();

  instance.setRoomBackground = jest.fn();

  instance.setFreeRooms();
  expect(instance.setState).toHaveBeenCalledWith({
    freeRooms: [1, 2, 3],
    currentTimeSlot: '00:00'
  });
});

xit('should call roomSearchActions.getFreeRoomsByTime with the correct value via handleChange', () => {
  roomSearchActions.getFreeRoomsByTime = jest.fn();
  let event = { target: { value: 'test' } };

  instance.handleChange(event);
  expect(roomSearchActions.getFreeRoomsByTime).toHaveBeenCalledWith('test');
});

it('should remove listeners before unmount', () => {
  roomSearchStore.removeListener = jest.fn();

  wrapper.unmount();

  expect(roomSearchStore.removeListener).toHaveBeenCalled();
});
