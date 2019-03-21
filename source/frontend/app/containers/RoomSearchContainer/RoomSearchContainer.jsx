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
import TB5 from '../../assets/img/FloorPlans/TB/TB5';
import TB6 from '../../assets/img/FloorPlans/TB/TB6';

import TE2 from '../../assets/img/FloorPlans/TE/TE2';
import TE3 from '../../assets/img/FloorPlans/TE/TE3';
import TE4 from '../../assets/img/FloorPlans/TE/TE4';
import TE5 from '../../assets/img/FloorPlans/TE/TE5';
import TE6 from '../../assets/img/FloorPlans/TE/TE6';

import TL2 from '../../assets/img/FloorPlans/TL/TL2';

import TH2 from '../../assets/img/FloorPlans/TH/TH2';

import AppBarContainer from '../AppBarContainer/AppBarContainer';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

class RoomSearchContainer extends Component {
  state = {
    floor: 'SOE',
    floors: {
      SOE: SOE,

      TB2: TB2,
      TB3: TB3,
      TB4: TB4,
      TB5: TB5,
      TB6: TB6,

      TE2: TE2,
      TE3: TE3,
      TE4: TE4,
      TE5: TE5,
      TE6: TE6,

      TH2: TH2,
      TL2: TL2
    },
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
    console.log(this.state.floor);
    console.log(event.target.id);
    let nextFloor = event.target.id;
    let tempFloors = [];

    if (nextFloor != 'SOE') {
      let building = nextFloor.substring(0, 2);
      console.log('building: ', building);

      for (let tempFloor in this.state.floors) {
        if (tempFloor.substring(0, 2) === building) {
          console.log(tempFloor);
          tempFloors.push(tempFloor);
        }
      }
    }

    this.setState({
      floor: nextFloor,
      currentFloors: tempFloors
    });
  };

  render() {
    const isThereData = this.state.freeRooms !== null;
    const Room = this.state.floors[this.state.floor];
    return (
      <Fragment>
        <AppBarContainer />
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
      </Fragment>
    );
  }
}

export default RoomSearchContainer;
