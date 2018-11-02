import React, { Component } from 'react';
import './NotFoundContainer.sass';

class NotFoundContainer extends Component {
  render() {
    return (
      <div className="NotFoundContainer">
        <h1>Status 404</h1>
        <h2>Resource not found >:(</h2>
      </div>
    );
  }
}

export default NotFoundContainer;
