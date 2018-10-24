import React, { Component } from 'react';
import './Search.sass';

import timetableStore from '../../stores/TimetableStore';
import * as timetableActions from '../../actions/TimetableActions';

class Search extends Component {
  state = { showInput: false };

  // Bind change listener
  componentWillMount() {}

  // Unbind change listener
  componentWillUnmount() {}

  toggleShowInput = () => {
    console.log('changing show input');
    this.setState({
      showInput: !this.state.showInput
    });
  };

  handleKeyPress = e => {
    const { value } = e.target;
    const { key } = e;
    if (key === 'Enter') {
      const currentDate = new Date();
      timetableActions.getTimetableByUsername(value, currentDate);
    }
  };

  render() {
    return (
      <div className="Search">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id="searchIcon"
          viewBox="0 0 24 24"
          onClick={this.toggleShowInput}
        >
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>

        {this.state.showInput && (
          <input
            type="text"
            name="search"
            autoFocus
            onKeyPress={e => this.handleKeyPress(e)}
          />
        )}
      </div>
    );
  }
}

export default Search;
