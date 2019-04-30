import React, { Component, Fragment } from 'react';
import { format } from 'date-fns';

import './RoomSearchContainer.sass';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';

import roomSearchStore from '../../stores/RoomSearchStore';
import * as roomSearchActions from '../../actions/RoomSearchActions';
import scheduleStore from '../../stores/ScheduleStore';

import AppBarContainer from '../AppBarContainer/AppBarContainer';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';

class RoomSearchContainer extends Component {
  state = {
    currentFreeRooms: roomSearchStore.currentFreeRooms,
    currentFloor: roomSearchStore.currentFloor,
    allFloors: roomSearchStore.allFloors,
    currentBuildingFloors: roomSearchStore.currentBuildingFloors,
    allRooms: [],
    slots: scheduleStore.slots,
    startTime: '2018-10-29T08:00:00+01:00',
    endTime: '2018-10-29T10:45:00+01:00',
    startTimeIndex: 0,
    endTimeIndex: 2,
    roomStates: {}
  };

  componentDidMount() {
    roomSearchActions.fetchFreeRoomData();
  }

  componentWillMount() {
    roomSearchStore.on('free_rooms_changed', this.setFreeRooms);
    roomSearchStore.on('selected_floor_changed', this.setFloor);
  }

  componentWillUnmount() {
    roomSearchStore.removeListener('free_rooms_changed', this.setFreeRooms);
    roomSearchStore.removeListener('selected_floor_changed', this.setFloor);
  }

  setFreeRooms = () => {
    this.setRoomBackground();
    this.setState({
      currentFreeRooms: roomSearchStore.currentFreeRooms
    });
  };

  setFloor = () => {
    this.setRoomBackground();
    this.setState({
      currentFreeRooms: roomSearchStore.currentFreeRooms,
      currentFloor: roomSearchStore.currentFloor,
      currentBuildingFloors: roomSearchStore.currentBuildingFloors
    });
  };

  setRoomBackground = () => {
    let tempRoomState = {};

    tempRoomState[roomSearchStore.currentFloor.substring(0, 3)] =
      'selectedFloor';

    // If there is a room then free room in soe
    if (roomSearchStore.currentFreeRooms[0]) {
      tempRoomState['SOE'] = 'free';
    }
    roomSearchStore.currentFreeRooms.map(room => {
      if (roomSearchStore.currentFloor === room.substring(0, 3)) {
        tempRoomState[room.substring(0, 2)] = 'free';
        tempRoomState[room] = 'free';
      } else {
        // Sets buildings that have free rooms
        tempRoomState[room.substring(0, 2)] = 'free';
        // Sets floors that have free rooms
        tempRoomState[room.substring(0, 3)] = 'free';
      }
    });

    this.setState({
      roomStates: tempRoomState
    });
  };

  handleSearchClick = () => {
    let { startTime, endTime } = this.state;
    roomSearchActions.getFreeRoomsByTime(startTime, endTime);
  };

  handleTimeChange = event => {
    let { startTimeIndex, endTimeIndex, slots } = this.state;
    if (event.target.name === 'startTime') {
      // Save how many slot where selected
      const distance = endTimeIndex - startTimeIndex;
      // Find the index corresponding to the value
      let startIndex = slots.findIndex(slot => {
        return slot.startTime === event.target.value;
      });
      // Set new endIndex with safety for array index bounds
      let endIndex = Math.min(slots.length - 1, startIndex + distance);
      this.setState({
        startTime: event.target.value,
        startTimeIndex: startIndex,
        endTime: slots[endIndex].endTime,
        endTimeIndex: endIndex
      });
    } else {
      // Find the index corresponding to the value
      let endIndex = slots.findIndex(slot => {
        return slot.endTime === event.target.value;
      });
      this.setState({
        endTime: event.target.value,
        endTimeIndex: endIndex
      });
    }
  };

  handleFloorClick = event => {
    roomSearchActions.changeFloor(event.target.id);
  };

  render() {
    const {
      currentFloor,
      allFloors,
      startTime,
      endTime,
      startTimeIndex,
      slots,
      roomStates,
      currentBuildingFloors
    } = this.state;

    // sets current floor to floor component
    const Floor = allFloors[currentFloor];

    return (
      <Fragment>
        <AppBarContainer>
          <Hidden mdUp>
            <Typography variant="h6" color="inherit" className="flex">
              ZHAWo
            </Typography>
          </Hidden>
        </AppBarContainer>
        <div className="ContentWrapper">
          <div className="RoomSearchContainer">
            <div className="selectContainer">
              <FormControl className="formControl">
                <Select
                  value={startTime}
                  onChange={this.handleTimeChange}
                  name="startTime"
                  classes={{
                    root: 'Select'
                  }}
                >
                  {slots.map(slot => (
                    <MenuItem value={slot.startTime} key={slot.startTime}>
                      {format(slot.startTime, 'HH:mm')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl className="formControl">
                <Select
                  value={endTime}
                  onChange={this.handleTimeChange}
                  name="endTime"
                  classes={{
                    root: 'Select'
                  }}
                >
                  {slots.map((slot, index) => (
                    <MenuItem
                      value={slot.endTime}
                      key={slot.endTime}
                      disabled={index < startTimeIndex}
                    >
                      {format(slot.endTime, 'HH:mm')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                onClick={this.handleSearchClick}
                color="inherit"
                variant="text"
                fontSize="small"
              >
                Search
              </Button>
            </div>
            <div className="selectorContainer">
              <div className="floorSelector">
                <div
                  id="SOE"
                  onClick={this.handleFloorClick}
                  className={roomStates['SOE']}
                >
                  SOE
                </div>
                {currentBuildingFloors.map(floor => (
                  <div
                    key={floor}
                    id={floor}
                    className={roomStates[floor]}
                    onClick={this.handleFloorClick}
                  >
                    {floor}
                  </div>
                ))}
              </div>
              <Floor
                clickhandler={this.handleFloorClick}
                roomStates={roomStates}
              />
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default RoomSearchContainer;
