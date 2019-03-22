import React, { Component, Fragment } from 'react';
import './VsZhawContainer.sass';

import { format } from 'date-fns';
import * as deLocale from 'date-fns/locale/de/index.js';
import * as vszhawActions from '../../actions/VsZhawActions';
import vszhawStore from '../../stores/VsZhawStore';
import AppBarContainer from '../AppBarContainer/AppBarContainer';

class VsZhawContainer extends Component {
  state = {
    feed: ''
  };

  componentDidMount() {
    vszhawActions.getVszhawFeed();
  }

  componentWillMount() {
    vszhawStore.on('got_vszhaw_feed', this.setFeed);
  }

  componentWillUnmount() {
    vszhawStore.removeListener('got_vszhaw_feed', this.setFeed);
  }

  setFeed = () => {
    this.setState({
      feed: vszhawStore.feed
    });
  };

  gotoLink = link => e => {
    let win = window.open(link, '_blank');
    win.focus();
  };

  render() {
    return (
      <Fragment>
        <AppBarContainer />
        <div className="ContentWrapper">
          <div className="VsZhawContainer">
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
