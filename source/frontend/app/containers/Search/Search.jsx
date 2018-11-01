import React, { Component } from 'react';
import './Search.sass';

import scheduleStore from '../../stores/ScheduleStore';
import * as scheduleActions from '../../actions/ScheduleActions';

class Search extends Component {
  state = { showInput: false };

  toggleShowInput = () => {
    this.setState({
      showInput: !this.state.showInput
    });
  };

  handleKeyPress = e => {
    const { value } = e.target;
    const { key } = e;
    if (key === 'Enter') {
      const currentDate = new Date();
      this.toggleShowInput();
      scheduleActions.getSchedule('students', value, currentDate);
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
            onKeyPress={this.handleKeyPress}
          />
        )}
      </div>
    );
  }
}

export default Search;
