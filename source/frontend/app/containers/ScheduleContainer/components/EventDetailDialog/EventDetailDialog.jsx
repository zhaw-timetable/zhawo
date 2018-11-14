import React, { Component } from 'react';
import { format } from 'date-fns';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import './EventDetailDialog.sass';

class EventDetailDialog extends Component {
  render() {
    const { open, event, handleClose } = this.props;
    return (
      <div>
        <Dialog
          className="EventDetailDialog"
          fullWidth={true}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle className="EventTitle" id="alert-dialog-title">
            {event.name}{' '}
            <strong style={{ float: 'right' }}>
              {event.eventRealizations[0].room.name}
            </strong>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {format(event.startTime, 'H:mm')} -{' '}
              {format(event.endTime, 'H:mm')}
              <br />
              <br />
            </DialogContentText>
            <DialogContentText id="alert-dialog-description">
              {event.eventRealizations[0].lecturers.map((lecturer, index) => (
                <span key={index}>
                  {lecturer.firstName +
                    ' ' +
                    lecturer.lastName +
                    ' (' +
                    lecturer.shortName +
                    ')'}
                  <br />
                </span>
              ))}
            </DialogContentText>
            <br />
            <br />
            {/* maybe add floorplan here with room highlighted? */}
            <svg className="placeholder" width="300px" height="200px" />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default EventDetailDialog;
