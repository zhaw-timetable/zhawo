// @flow

import React, { Component } from 'react';
import './Splash.sass';
import * as globalActions from '../../actions/GlobalActions';
import globalStore from '../../stores/GlobalStore';

type Props = {};
type State = {};

class Splash extends Component<Props, State> {
  state = {};

  // Bind change listener
  componentWillMount() {}

  // Unbind change listener
  componentWillUnmount() {}

  render() {
    return (
      <div className="Splash">
        <svg className="SplashSVG" viewBox="0 0 600 600" version="1.1">
          <title>Assets/App Icon/iTunesArtwork</title>
          <desc>Created with Sketch.</desc>
          <defs />
          <g
            id="Page-1"
            stroke="none"
            stroke-width="1"
            fill="none"
            fill-rule="evenodd"
          >
            <g id="Assets/App-Icon/iTunesArtwork">
              <g id="Logo" transform="translate(-1.000000, 0.000000)">
                <text
                  id="questionmark"
                  transform="translate(240.000000, 336.000000) rotate(-90.000000) translate(-240.000000, -336.000000) "
                  font-family="Roboto-Light, Roboto"
                  font-size="400"
                  font-weight="300"
                  fill="#EFEFF4"
                >
                  <tspan x="150" y="483">
                    ?
                  </tspan>
                </text>
                <text id="W" fill="#EFEFF4">
                  <tspan x="284" y="260">
                    W
                  </tspan>
                </text>
                <text id="o" fill="#EFEFF4">
                  <tspan x="355" y="355">
                    o
                  </tspan>
                </text>
                <text
                  id="zha"
                  font-family="Roboto-Light, Roboto"
                  font-size="144"
                  font-weight="300"
                  fill="#EFEFF4"
                >
                  <tspan x="53" y="208">
                    zha
                  </tspan>
                </text>
              </g>
            </g>
          </g>
        </svg>
      </div>
    );
  }
}

export default Splash;
