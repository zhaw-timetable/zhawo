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
    floor: roomSearchStore.currentFloor,
    floors: roomSearchStore.floors,
    currentFloors: [],
    freeRooms: null,
    timeSlots: scheduleStore.slots,
    currentTimeSlot: ''
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
    this.setState({
      freeRooms: roomSearchStore.currentfreeRooms,
      currentTimeSlot: roomSearchStore.currentTimeSlot
    });
  };

  setFloor = () => {
    console.log('roomSearchStore.currentFloor: ', roomSearchStore.currentFloor);
    console.log(
      'roomSearchStore.currentFloors: ',
      roomSearchStore.currentFloors
    );
    console.log('this.state.floors: ', this.state.floors);

    this.setState({
      floor: roomSearchStore.currentFloor,
      currentFloors: roomSearchStore.currentFloors
    });
  };

  handleChange = event => {
    roomSearchActions.getFreeRoomsByTime(event.target.value);
  };

  handleClick = event => {
    console.log('Click happened, should change to TB2');
    console.log(event.target.id);
    roomSearchActions.changeFloor(event.target.id);
  };

  render() {
    const isThereData = this.state.freeRooms !== null;
    const Room = this.state.floors[this.state.floor];

    return (
      <Fragment>
        <AppBarContainer />
        <div className="ContentWrapper">
          <div className="RoomSearchContainer">
            <div className="floorSelector">
              <div id="SOE" onClick={this.handleClick}>
                SOE
              </div>
              {this.state.currentFloors.map(floor => (
                <div key={floor} id={floor} onClick={this.handleClick}>
                  {floor}
                </div>
              ))}
            </div>
            <Room clickhandler={this.handleClick} />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default RoomSearchContainer;
