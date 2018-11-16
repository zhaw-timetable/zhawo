import React, { Component, Fragment } from 'react';
import { format } from 'date-fns';

import './RoomSearchContainer.sass';

import roomSearchStore from '../../stores/RoomSearchStore';
import * as roomSearchActions from '../../actions/RoomSearchActions';

import AppBarContainer from '../AppBarContainer/AppBarContainer';

class RoomSearchContainer extends Component {
  state = { freeRooms: null };

  componentDidMount() {
    roomSearchActions.getFreeRoomsJson();
  }

  componentWillMount() {
    roomSearchStore.on('got_FreeRooms', this.setFreeRooms);
  }

  componentWillUnmount() {
    roomSearchStore.removeListener('got_FreeRooms', this.setFreeRooms);
  }

  setFreeRooms = () => {
    console.log('Rooms found');
    console.log(roomSearchStore.freeRooms);
    this.setState({ freeRooms: roomSearchStore.freeRooms });
  };
  render() {
    const isThereData = this.state.freeRooms !== null;
    console.log(this.state.freeRooms !== null);
    return (
      <Fragment>
        <AppBarContainer />
        <div className="RoomSearchContainer">
          {isThereData &&
            this.state.freeRooms.map(slot => (
              <div key={slot.slot.startTime}>
                <h1>{slot.slot.startTime}</h1>
                {slot.rooms.map(room => (
                  <p key={(slot.slot.startTime, room)}>{room}</p>
                ))}
              </div>
            ))}
          <h1>{isThereData}</h1>
        </div>
      </Fragment>
    );
  }
}

export default RoomSearchContainer;
