import React, { Component, Fragment } from 'react';
import './VsZhawContainer.sass';
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

  render() {
    return (
      <Fragment>
        <AppBarContainer />
        <div className="ContentWrapper">
          <div className="VsZhawContainer">
            <h1>VSZHAW</h1>
            {this.state.feed &&
              this.state.feed.map(post => (
                <div className="Post" key={post.link}>
                  <h2>{post.title}</h2>
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
