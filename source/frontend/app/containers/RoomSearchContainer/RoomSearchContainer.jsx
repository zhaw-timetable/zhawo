import React, { Component, Fragment } from 'react';
import { format } from 'date-fns';

import './RoomSearchContainer.sass';

import roomSearchStore from '../../stores/RoomSearchStore';
import * as roomSearchActions from '../../actions/RoomSearchActions';
import scheduleStore from '../../stores/ScheduleStore';

import SOE from '../../assets/img/FloorPlans/SOE';

import TB2 from '../../assets/img/FloorPlans/TB/TB2';
import TB3 from '../../assets/img/FloorPlans/TB/TB3';
import TB4 from '../../assets/img/FloorPlans/TB/TB4';

import AppBarContainer from '../AppBarContainer/AppBarContainer';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

class RoomSearchContainer extends Component {
  state = {
    room: 'SOE',
    rooms: {
      TB2: TB2,
      TB3: TB3,
      TB4: TB4,
      SOE: SOE
    },
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

  handleClick = event => {
    console.log('Click happened, should change to TB2');
    console.log(this.state.room);
    console.log(event.target.id);
    this.setState({
      room: event.target.id
    });
  };

  render() {
    const isThereData = this.state.freeRooms !== null;
    const Room = this.state.rooms[this.state.room];
    return (
      <Fragment>
        <AppBarContainer />
        <div className="ContentWrapper">
          <div className="RoomSearchContainer">
            <div className="floorSelector">
              <div id="SOE" onClick={this.handleClick}>
                SOE
              </div>
              <div id="TB2" onClick={this.handleClick}>
                2
              </div>
              <div id="TB3" onClick={this.handleClick}>
                3
              </div>
              <div id="TB4" onClick={this.handleClick}>
                4
              </div>
            </div>
            <Room clickhandler={this.handleClick} />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default RoomSearchContainer;
