import React, { Component } from 'react';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import './Carbon.css';

/* 
Built to look like carbon.
beautiful source code
https://carbon.now.sh
*/

export default class Carbon extends Component {
  render() {
    return (
      <div className={'Carbon ' + this.props.className}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="54"
          height="14"
          viewBox="0 0 54 14"
        >
          <g fill="none" fill-rule="evenodd" transform="translate(1 1)">
            <circle
              cx="6"
              cy="6"
              r="6"
              fill="#FF5F56"
              stroke="#E0443E"
              stroke-width=".5"
            />
            <circle
              cx="26"
              cy="6"
              r="6"
              fill="#FFBD2E"
              stroke="#DEA123"
              stroke-width=".5"
            />
            <circle
              cx="46"
              cy="6"
              r="6"
              fill="#27C93F"
              stroke="#1AAB29"
              stroke-width=".5"
            />
          </g>
        </svg>
        <SyntaxHighlighter language={this.props.lang} style={vs2015}>
          {this.props.children}
        </SyntaxHighlighter>
      </div>
    );
  }
}
