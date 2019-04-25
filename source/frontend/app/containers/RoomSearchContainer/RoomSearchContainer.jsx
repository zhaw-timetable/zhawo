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
    floor: roomSearchStore.currentFloor,
    floors: roomSearchStore.floors,
    currentFloors: [],
    freeRooms: null,
    timeSlots: scheduleStore.slots,
    startTime: '2018-10-29T08:00:00+01:00',
    endTime: '2018-10-29T10:45:00+01:00',
    roomStates: {}
  };

  componentDidMount() {
    roomSearchActions.getFreeRoomsJson();
  }

  componentWillMount() {
    roomSearchStore.on('got_currentFreeRooms', this.setFreeRooms);
    roomSearchStore.on('newFloor', this.setFloor);
  }

  componentWillUnmount() {
    roomSearchStore.removeListener('got_currentFreeRooms', this.setFreeRooms);
    roomSearchStore.removeListener('newFloor', this.setFloor);
  }

  setFreeRooms = () => {
    this.setRoomBackground();
    this.setState({
      freeRooms: roomSearchStore.currentfreeRooms,
      currentTimeSlot: roomSearchStore.currentTimeSlot
    });
  };

  setFloor = () => {
    this.setRoomBackground();
    this.setState({
      freeRooms: roomSearchStore.currentfreeRooms,
      floor: roomSearchStore.currentFloor,
      currentFloors: roomSearchStore.currentFloors
    });
  };

  setRoomBackground = () => {
    let tempRoomState = {};

    tempRoomState[roomSearchStore.currentFloor.substring(0, 3)] =
      'selectedFloor';

    // If there is a room then free room in soe
    if (roomSearchStore.currentfreeRooms[0]) {
      tempRoomState['SOE'] = 'free';
    }
    roomSearchStore.currentfreeRooms.map(room => {
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

  handleChange = event => {
    // Todo: filter
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleClick = event => {
    roomSearchActions.changeFloor(event.target.id);
  };

  render() {
    const isThereData = this.state.freeRooms !== null;

    // sets current floor to floor component
    const Floor = this.state.floors[this.state.floor];

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
                  onChange={this.handleChange}
                  name="startTime"
                  classes={{
                    root: 'Select'
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {this.state.timeSlots.map(slot => (
                    <MenuItem value={slot.startTime} key={slot.startTime}>
                      {format(slot.startTime, 'HH:mm')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl className="formControl">
                <Select
                  value={this.state.endTime}
                  onChange={this.handleChange}
                  name="endTime"
                  classes={{
                    root: 'Select'
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {this.state.timeSlots.map(slot => (
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
                {this.state.currentFloors.map(floor => (
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
