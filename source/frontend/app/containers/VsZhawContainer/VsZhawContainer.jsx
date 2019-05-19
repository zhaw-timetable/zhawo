import React, { Component, Fragment } from 'react';

import './VsZhawContainer.sass';

import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';

import { format } from 'date-fns';
import * as deLocale from 'date-fns/locale/de/index.js';
import * as vszhawActions from '../../actions/VsZhawActions';
import vszhawStore from '../../stores/VsZhawStore';
import AppBarContainer from '../AppBarContainer/AppBarContainer';

class VsZhawContainer extends Component {
  state = {
    feed: '',
    events: vszhawStore.events
  };

  componentDidMount() {
    vszhawActions.getVszhawFeed();
    if (!(vszhawStore.events.length > 0)) {
      vszhawActions.getVszhawEvents();
    }
  }

  componentWillMount() {
    vszhawStore.on('got_vszhaw_feed', this.setFeed);
    vszhawStore.on('got_vszhaw_events', this.setEvents);
  }

  componentWillUnmount() {
    vszhawStore.removeListener('got_vszhaw_feed', this.setFeed);
    vszhawStore.removeListener('got_vszhaw_events', this.setEvents);
  }

  /**
   * Function call when store changes.
   * Sets local feed state to match store
   *
   * @memberof VsZhawContainer
   */
  setFeed = () => {
    this.setState({
      feed: vszhawStore.feed
    });
  };

  /**
   * Function call when store changes.
   * Sets local events state to match store
   *
   * @memberof VsZhawContainer
   */
  setEvents = () => {
    this.setState({
      events: vszhawStore.events
    });
  };

  /**
   * Function that forwards to given link
   *
   * @param {string} link
   * @memberof VsZhawContainer
   */
  gotoLink = link => e => {
    let win = window.open(link, '_blank');
    win.focus();
  };

  render() {
    return (
      <Fragment>
        <AppBarContainer>
          <Hidden mdUp>
            <Typography variant="h6" color="inherit" className="flex">
              ZHAWo
            </Typography>
          </Hidden>
        </AppBarContainer>
        <div className="ContentWrapper">
          <div className="VsZhawContainer">
            {this.state.events.length > 0 && (
              <div
                className="VsZhawEvent Post"
                onClick={this.gotoLink(this.state.events[0].eventUrl)}
              >
                <h2>Nächster Event:</h2>
                <div className="EventTime">
                  {format(
                    new Date(this.state.events[0].eventDate),
                    'D. MMMM YYYY',
                    {
                      locale: deLocale
                    }
                  )}
                  :
                </div>
                <div className="EventName">
                  {this.state.events[0].eventName}
                </div>
              </div>
            )}
            {this.state.feed &&
              this.state.feed.map(post => (
                <div
                  className="Post"
                  key={post.link}
                  onClick={this.gotoLink(post.link)}
                >
                  <h2>{post.title}</h2>
                  <h3>
                    {post.creator},{' '}
                    {format(new Date(post.pubDate), 'D. MMMM YYYY', {
                      locale: deLocale
                    })}
                  </h3>
                  {post.contentSnippet}
                </div>
              ))}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default VsZhawContainer;
