import React, { Component } from 'react';
import './LogoSVG.sass';

class LogoSVG extends Component {
  state = {};

  render() {
    return (
      <svg viewBox="0 0 512 512">
        <rect
          id="logo-bg"
          fill="#0076FF"
          x="0"
          y="0"
          width="516"
          height="516"
        />
        <text
          id="?"
          transform="translate(240.000000, 336.000000) rotate(-90.000000) translate(-240.000000, -336.000000) "
          fontFamily="Roboto-Light, Roboto"
          fontSize="400"
          fontWeight="300"
          fill="#EFEFF4"
        >
          <tspan x="151" y="473">
            ?
          </tspan>
        </text>
        <text
          id="W"
          fontFamily="Roboto-Bold, Roboto"
          fontSize="200"
          fontWeight="bold"
          fill="#EFEFF4"
        >
          <tspan x="284" y="260">
            W
          </tspan>
        </text>
        <text
          id="zha"
          fontFamily="Roboto-Light, Roboto"
          fontSize="144"
          fontWeight="300"
          fill="#EFEFF4"
        >
          <tspan x="53" y="208">
            zha
          </tspan>
        </text>
      </svg>
    );
  }
}

export default LogoSVG;
