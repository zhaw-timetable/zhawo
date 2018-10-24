import React, { Component } from 'react';

import './Splash.sass';

import globalStore from '../../stores/GlobalStore';
import * as globalActions from '../../actions/GlobalActions';

class Splash extends Component {
  state = {};

  // Bind change listener
  componentWillMount() {}

  // Unbind change listener
  componentWillUnmount() {}

  render() {
    return (
      <div className="Splash">
        <svg className="SplashSVG" viewBox="-80 0 700 500" version="1.1">
          <g id="Logo">
            <text
              id="questionmark"
              transform="translate(240.000000, 336.000000) rotate(-90.000000) translate(-240.000000, -336.000000) "
              fontFamily="Roboto Light"
              fontSize="400"
              fontWeight="300"
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
              <tspan x="358" y="355">
                o
              </tspan>
            </text>
            <text
              id="zha"
              fontFamily="Roboto Light"
              fontSize="144"
              fontWeight="300"
              fill="#EFEFF4"
            >
              <tspan x="53" y="208">
                zha
              </tspan>
            </text>
          </g>
        </svg>
      </div>
    );
  }
}

export default Splash;
