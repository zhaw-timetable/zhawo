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

it('should set Background for free rooms', () => {
  let tempRoomState = {
    roomStates: {
      TH2: 'selectedFloor',
      SOE: 'free',
      LS: 'free',
      LS2: 'free',
      LT: 'free',
      LTA: 'free',
      MD: 'free',
      MDZ: 'free',
      MY: 'free',
      MYE: 'free',
      TB: 'free',
      TB1: 'free',
      TB4: 'free',
      TB5: 'free',
      TB6: 'free',
      TC: 'free',
      TCE: 'free',
      TCO: 'free',
      TCU: 'free',
      TE: 'free',
      TE1: 'free',
      TE2: 'free',
      TE3: 'free',
      TE4: 'free',
      TE5: 'free',
      TE6: 'free',
      TH: 'free',
      TH263: 'free',
      TH3: 'free',
      TH4: 'free',
      TH5: 'free',
      TL: 'free',
      TL1: 'free',
      TL2: 'free',
      TL3: 'free',
      TL4: 'free',
      TM: 'free',
      TMO: 'free',
      TP: 'free',
      TP1: 'free',
      TP4: 'free',
      TV: 'free',
      TV2: 'free',
      ZL: 'free',
      ZLO: 'free'
    }
  };

  roomSearchStore.currentFreeRooms = [
    'LS203',
    'LTAE130',
    'MDZ1.12',
    'MYE0.07',
    'TB149',
    'TB151',
    'TB155',
    'TB404',
    'TB414',
    'TB434',
    'TB504',
    'TB514',
    'TB630',
    'TCE0.14',
    'TCO1.14',
    'TCO2.14',
    'TCO2.48',
    'TCO2.50',
    'TCO3.13',
    'TCO3.48',
    'TCU1.14',
    'TE119',
    'TE205',
    'TE211',
    'TE214',
    'TE314',
    'TE316',
    'TE414',
    'TE502',
    'TE507',
    'TE516',
    'TE519',
    'TE523',
    'TE528',
    'TE616',
    'TE622',
    'TE626',
    'TH263',
    'TH335',
    'TH343',
    'TH431',
    'TH433',
    'TH444',
    'TH541',
    'TH553',
    'TL121',
    'TL203',
    'TL311',
    'TL312',
    'TL336',
    'TL412',
    'TL434',
    'TMO1.11',
    'TP105',
    'TP402',
    'TP404',
    'TP406',
    'TP408',
    'TV205',
    'ZLO3.16',
    'ZLO3.20',
    'ZLO5.08',
    'ZLO5.10',
    'ZLO5.12',
    'ZLO5.14',
    'ZLO5.16',
    'ZLO6.04',
    'ZLO6.06',
    'ZLO6.08',
    'ZLO6.09',
    'ZLO6.16'
  ];
  roomSearchStore.currentFloor = 'TH2';

  instance.state.roomStates = {};

  instance.setState = jest.fn();

  instance.setRoomBackground();

  expect(instance.setState).toHaveBeenCalledWith(tempRoomState);
});

it('should call setState via setFreeRooms with correct values and call set RommBackground ', () => {
  let tempFreeRooms = [1, 2, 3];

  roomSearchStore.currentFreeRooms = tempFreeRooms;
  instance.setState = jest.fn();

  instance.setRoomBackground = jest.fn();

  instance.setFreeRooms();
  expect(instance.setState).toHaveBeenCalledWith({
    currentFreeRooms: tempFreeRooms
  });
  expect(instance.setRoomBackground).toHaveBeenCalled();
  instance.setRoomBackground.mockRestore();
});

it('should call setFloor via setFreeRooms with correct values and call set RommBackground ', () => {
  let tempFreeRooms = [1, 2, 3];
  let tempFloor = 'TB';
  let tempBuildingFloors = [1, 2, 3];

  roomSearchStore.currentFreeRooms = tempFreeRooms;
  roomSearchStore.currentFloor = tempFloor;
  roomSearchStore.currentBuildingFloors = tempBuildingFloors;

  instance.setState = jest.fn();

  instance.setRoomBackground = jest.fn();

  instance.setFloor();
  expect(instance.setState).toHaveBeenCalledWith({
    currentFreeRooms: tempFreeRooms,
    currentFloor: tempFloor,
    currentBuildingFloors: tempBuildingFloors
  });
  expect(instance.setRoomBackground).toHaveBeenCalled();

  instance.setRoomBackground.mockRestore();
});

it('should call getFreeRoooomsByTime with start and end time from handleSearchClick', () => {
  let tempStart = '2018-10-29T08:00:00+01:00';
  let tempEnd = '2018-10-29T10:45:00+01:00';

  instance.state.startTime = tempStart;
  instance.state.endTime = tempEnd;

  roomSearchActions.getFreeRoomsByTime = jest.fn();

  instance.handleSearchClick();

  expect(roomSearchActions.getFreeRoomsByTime).toHaveBeenCalledWith(
    tempStart,
    tempEnd
  );
});

it('should set Time in state correct from handleTimeChange', () => {
  let tempStart = 0;
  let tempEnd = 2;

  instance.state.startTimeIndex = tempStart;
  instance.state.endTimeIndex = tempEnd;
  instance.state.slots = [
    {
      endTime: '2018-10-29T08:45:00+01:00',
      startTime: '2018-10-29T08:00:00+01:00'
    },
    {
      endTime: '2018-10-29T09:35:00+01:00',
      startTime: '2018-10-29T08:50:00+01:00'
    },
    {
      endTime: '2018-10-29T10:45:00+01:00',
      startTime: '2018-10-29T10:00:00+01:00'
    }
  ];

  instance.setState = jest.fn();

  instance.handleTimeChange({
    target: { value: '2018-10-29T10:45:00+01:00' }
  });

  expect(instance.setState).toHaveBeenCalledWith({
    endTime: '2018-10-29T10:45:00+01:00',
    endTimeIndex: tempEnd
  });
});

it('should set Time in state correct from handleTimeChange', () => {
  let tempStart = 0;
  let tempEnd = 1;

  instance.state.startTimeIndex = tempStart;
  instance.state.endTimeIndex = tempEnd;
  instance.state.slots = [
    {
      endTime: '2018-10-29T08:45:00+01:00',
      startTime: '2018-10-29T08:00:00+01:00'
    },
    {
      endTime: '2018-10-29T09:35:00+01:00',
      startTime: '2018-10-29T08:50:00+01:00'
    },
    {
      endTime: '2018-10-29T10:45:00+01:00',
      startTime: '2018-10-29T10:00:00+01:00'
    }
  ];

  instance.setState = jest.fn();

  instance.handleTimeChange({
    target: { name: 'startTime', value: '2018-10-29T08:00:00+01:00' }
  });

  expect(instance.setState).toHaveBeenCalledWith({
    startTime: '2018-10-29T08:00:00+01:00',
    startTimeIndex: tempStart,
    endTime: '2018-10-29T09:35:00+01:00',
    endTimeIndex: tempEnd
  });
});

it('should should call changeFloor from handleFloorClick', () => {
  let event = { target: { id: 2 } };

  roomSearchActions.changeFloor = jest.fn();

  instance.handleFloorClick(event);
  expect(roomSearchActions.changeFloor).toHaveBeenCalledWith(2);
});

it('should remove listeners before unmount', () => {
  roomSearchStore.removeListener = jest.fn();

  wrapper.unmount();

  expect(roomSearchStore.removeListener).toHaveBeenCalled();
});
