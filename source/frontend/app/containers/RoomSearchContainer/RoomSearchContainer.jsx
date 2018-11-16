import React, { Component, Fragment } from 'react';
import { format } from 'date-fns';

import './RoomSearchContainer.sass';

import roomSearchStore from '../../stores/RoomSearchStore';
import * as roomSearchActions from '../../actions/RoomSearchActions';

import AppBarContainer from '../AppBarContainer/AppBarContainer';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

class RoomSearchContainer extends Component {
  state = {
    freeRooms: null,
    expanded: '2018-11-16T08:00:00+01:00'
  };

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

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false
    });
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
                <ExpansionPanel
                  expanded={this.state.expanded === slot.slot.startTime}
                  onChange={this.handleChange(slot.slot.startTime)}
                >
                  <ExpansionPanelSummary>
                    Free Roooms from:
                    {slot.slot.startTime} until:
                    {slot.slot.endTime}{' '}
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <div className="roomContainer">
                      <List>
                        {slot.rooms.map(room => (
                          <ListItem key={(slot.slot.startTime, room)}>
                            {room}
                          </ListItem>
                        ))}
                      </List>
                    </div>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </div>
            ))}
          <h1>{isThereData}</h1>
        </div>
      </Fragment>
    );
  }
}

export default RoomSearchContainer;
