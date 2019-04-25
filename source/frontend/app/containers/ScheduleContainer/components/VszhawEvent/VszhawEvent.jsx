import React, { Component } from 'react';

import { format } from 'date-fns';
import * as deLocale from 'date-fns/locale/de/index.js';

import './VszhawEvent.sass';

import VsZHAWSVG from '../../../../assets/img/VsZHAWSVG/VsZHAWSVG';

class VszhawEvent extends Component {
  gotoLink = link => e => {
    let win = window.open(link, '_blank');
    win.focus();
  };

  render() {
    const { event, dayView } = this.props;
    const dateString = format(new Date(event.eventDate), 'D. MMMM YYYY', {
      locale: deLocale
    });
    return (
      <div className="VszhawEvent" onClick={this.gotoLink(event.eventUrl)}>
        {!dayView && <div>{dateString}:</div>}
        <div>
          <VsZHAWSVG />
          <div className="VszhawEventName">{event.eventName}</div>
          <VsZHAWSVG />
        </div>
      </div>
    );
  }
}

export default VszhawEvent;
