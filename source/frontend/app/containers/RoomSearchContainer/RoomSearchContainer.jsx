import React, { Component, Fragment } from 'react';
import { format } from 'date-fns';

import './RoomSearchContainer.sass';

import roomSearchStore from '../../stores/RoomSearchStore';
import * as roomSearchActions from '../../actions/RoomSearchActions';
import scheduleStore from '../../stores/ScheduleStore';

import AppBarContainer from '../AppBarContainer/AppBarContainer';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

class RoomSearchContainer extends Component {
  state = {
    freeRooms: null,
    timeSlots: scheduleStore.slots,
    currentTimeSlot: ''
  };

  componentDidMount() {
    roomSearchActions.getFreeRoomsJson();
  }

  componentWillMount() {
    roomSearchStore.on('got_currentFreeRooms', this.setFreeRooms);
  }

  componentWillUnmount() {
    roomSearchStore.removeListener('got_currentFreeRooms', this.setFreeRooms);
  }

  setFreeRooms = () => {
    this.setState({
      freeRooms: roomSearchStore.currentfreeRooms,
      currentTimeSlot: roomSearchStore.currentTimeSlot
    });
  };

  handleChange = event => {
    roomSearchActions.getFreeRoomsByTime(event.target.value);
  };

  render() {
    const isThereData = this.state.freeRooms !== null;
    return (
      <Fragment>
        <AppBarContainer />
        <div className="RoomSearchContainer">
          <h2>Select a timeslot start time</h2>
          <Select
            value={this.state.currentTimeSlot}
            onChange={this.handleChange}
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
          <div className="listContainer">
            <List>
              {isThereData &&
                this.state.freeRooms.map(room => (
                  <ListItem key={room}>{room}</ListItem>
                ))}
            </List>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default RoomSearchContainer;
