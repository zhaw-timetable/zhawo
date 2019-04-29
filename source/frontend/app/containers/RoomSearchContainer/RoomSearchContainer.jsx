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

  handleButton = () => {
    roomSearchActions.getFreeRoomsByTime(
      this.state.startTime,
      this.state.endTime
    );
  };

  handleTimeChange = event => {
    // Todo: filter
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleClick = event => {
    roomSearchActions.changeFloor(event.target.id);
  };

  render() {
    const { currentFloor, allFloors } = this.state;

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
                  value={this.state.startTime}
                  onChange={this.handleTimeChange}
                  name="startTime"
                  classes={{
                    root: 'Select'
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {this.state.slots.map(slot => (
                    <MenuItem value={slot.startTime} key={slot.startTime}>
                      {format(slot.startTime, 'HH:mm')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl className="formControl">
                <Select
                  value={this.state.endTime}
                  onChange={this.handleTimeChange}
                  name="endTime"
                  classes={{
                    root: 'Select'
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {this.state.slots.map(slot => (
                    <MenuItem value={slot.endTime} key={slot.endTime}>
                      {format(slot.endTime, 'HH:mm')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                onClick={this.handleButton}
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
                  onClick={this.handleClick}
                  className={this.state.roomStates['SOE']}
                >
                  SOE
                </div>
                {this.state.currentBuildingFloors.map(floor => (
                  <div
                    key={floor}
                    id={floor}
                    className={this.state.roomStates[floor]}
                    onClick={this.handleClick}
                  >
                    {floor}
                  </div>
                ))}
              </div>
              <Floor
                clickhandler={this.handleClick}
                roomStates={this.state.roomStates}
              />
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default RoomSearchContainer;
