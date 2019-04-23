import React, { Component } from 'react';

import './VszhawEvent.sass';

import VsZHAWSVG from '../../../../assets/img/VsZHAWSVG/VsZHAWSVG';

class VszhawEvent extends Component {
  gotoLink = link => e => {
    let win = window.open(link, '_blank');
    win.focus();
  };

  render() {
    const { event, dayView } = this.props;
    return (
      <div className="VszhawEvent" onClick={this.gotoLink(event.eventUrl)}>
        <VsZHAWSVG />
        {event.eventName}
        <VsZHAWSVG />
      </div>
    );
  }
}

export default VszhawEvent;
