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
    this.setState({ freeRooms: roomSearchStore.freeRooms });
  };
  render() {
    const isThereData = this.state.freeRooms !== null;
    return (
      <Fragment>
        <AppBarContainer />
        <div className="RoomSearchContainer">
          {isThereData &&
            this.state.freeRooms.map(slot => (
              <div key={slot.slot.startTime}>
                <h1>
                  Free Roooms from:
                  {slot.slot.startTime} until:
                  {slot.slot.endTime}{' '}
                </h1>
                <div className="roomContainer">
                  {slot.rooms.map(room => (
                    <p key={(slot.slot.startTime, room)}>{room}</p>
                  ))}
                </div>
              </div>
            ))}
          <h1>{isThereData}</h1>
        </div>
      </Fragment>
    );
  }
}

export default RoomSearchContainer;
