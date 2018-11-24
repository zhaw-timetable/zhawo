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
    currentTimeSlot: roomSearchStore.currentTimeSlot
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
          <Select
            value={this.state.currentTimeSlot}
            onChange={this.handleChange}
          >
            {this.state.timeSlots.map(slot => (
              <MenuItem value={slot.startTime} key={slot.startTime}>
                {slot.startTime}
              </MenuItem>
            ))}
          </Select>

          <List>
            {isThereData &&
              this.state.freeRooms.map(room => (
                <ListItem key={room}>{room}</ListItem>
              ))}
          </List>
        </div>
      </Fragment>
    );
  }
}

export default RoomSearchContainer;
