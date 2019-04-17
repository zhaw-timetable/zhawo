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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';

class RoomSearchContainer extends Component {
  state = {
    floor: roomSearchStore.currentFloor,
    floors: roomSearchStore.floors,
    currentFloors: [],
    freeRooms: null,
    timeSlots: scheduleStore.slots,
    // startTime: '2018-10-29T08:00:00+01:00',
    // endTime: '2018-10-29T11:35:00+01:00',
    startTime: '',
    endTime: '',
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
    // If there is a room then free room in soe
    if (roomSearchStore.currentfreeRooms[0]) {
      tempRoomState['SOE'] = 'free';
    }
    roomSearchStore.currentfreeRooms.map(room => {
      // console.log('room: ', room);
      if (roomSearchStore.currentFloor === room.substring(0, 3)) {
        console.log('room: ', room);
        tempRoomState[room.substring(0, 2)] = 'free';
        tempRoomState[room] = 'free';
      } else {
        console.log('Levels with free rooms: ', room.substring(0, 3));
        // Sets buildings that have free rooms
        tempRoomState[room.substring(0, 2)] = 'free';
        // Sets floors that have free rooms
        tempRoomState[room.substring(0, 3)] = 'free';
      }
    });
    console.log(tempRoomState);

    this.setState({
      roomStates: tempRoomState
    });
  };

  handleButton = () => {
    console.log(
      'startTime: ',
      this.state.startTime,
      'endtime: ',
      this.state.endTime
    );

    roomSearchActions.getFreeRoomsByTime(
      this.state.startTime,
      this.state.endTime
    );
  };

  handleChange = event => {
    // Todo: filter
    console.log(event.target.name, ':', event.target.value);

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
              <Button
                onClick={this.handleButton}
                color="inherit"
                variant="text"
                fontSize="small"
              >
                Search
              </Button>
            </div>
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
      </Fragment>
    );
  }
}

export default RoomSearchContainer;
