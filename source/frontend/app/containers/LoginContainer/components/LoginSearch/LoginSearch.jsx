import React, { Component, Fragment } from 'react';

import globalStore from '../../../../stores/GlobalStore';
import * as globalActions from '../../../../actions/GlobalActions';

import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative',
    height: 250
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  },
  suggestion: {
    display: 'block'
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none'
  }
});

class IntegrationAutosuggest extends Component {
  state = {
    value: '',
    suggestions: [],
    locked: true,
    possibleLoginNames: globalStore.possibleLoginNames
  };

  componentWillMount() {
    globalStore.on('possible_names_changed', this.refreshPossibleLoginNames);
  }

  componentWillUnmount() {
    globalStore.removeListener(
      'possible_names_changed',
      this.refreshPossibleLoginNames
    );
  }

  componentDidMount() {
    // only reload if globalStore doesnt have the data yet
    if (globalStore.possibleNames.length === 0) {
      globalActions.getPossibleNames();
    }
  }

  refreshPossibleLoginNames = () => {
    this.setState({
      possibleLoginNames: globalStore.possibleLoginNames
    });
  };

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  handleChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  setCurrentUser = () => {
    // Sets globalStore currentUser to value of input
    globalActions.setCurrentUser(this.state.value);
  };

  getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0
      ? []
      : this.state.possibleLoginNames.filter(suggestion => {
          const keep =
            count < 5 &&
            suggestion.label.toLowerCase().slice(0, inputLength) === inputValue;

          if (keep) {
            count += 1;
          }

          return keep;
        });
  };

  getSuggestionValue = suggestion => {
    return suggestion.label;
  };

  render() {
    const { classes } = this.props;

    return (
      <Fragment>
        <Autosuggest
          theme={{
            container: classes.container,
            suggestionsContainerOpen: classes.suggestionsContainerOpen,
            suggestionsList: classes.suggestionsList,
            suggestion: classes.suggestion
          }}
          renderInputComponent={renderInput}
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
          renderSuggestionsContainer={renderSuggestionsContainer}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={{
            classes,
            placeholder: 'Nach Kürzel suchen',
            value: this.state.value,
            onChange: this.handleChange
          }}
        />
        <button onClick={this.setCurrentUser}>Let's Go</button>
      </Fragment>
    );
  }
}

IntegrationAutosuggest.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(IntegrationAutosuggest);

function renderInput(inputProps) {
  const { classes, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: ref,
        classes: {
          input: classes.input
        },
        ...other
      }}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 700 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </strong>
          );
        })}
      </div>
    </MenuItem>
  );
}

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
}

// import React, { Component } from 'react';
// import './Search.sass';

// import scheduleStore from '../../stores/ScheduleStore';
// import * as scheduleActions from '../../actions/ScheduleActions';

// class Search extends Component {
//   state = { showInput: false };

//   toggleShowInput = () => {
//     this.setState({
//       showInput: !this.state.showInput
//     });
//   };

//   handleKeyPress = e => {
//     const { value } = e.target;
//     const { key } = e;
//     if (key === 'Enter') {
//       const currentDate = new Date();
//       this.toggleShowInput();
//       scheduleActions.getSchedule('students', value, currentDate);
//     }
//   };

//   render() {
//     return (
//       <div className="Search">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           id="searchIcon"
//           viewBox="0 0 24 24"
//           onClick={this.toggleShowInput}
//         >
//           <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
//         </svg>

//         {this.state.showInput && (
//           <input
//             type="text"
//             name="search"
//             autoFocus
//             onKeyPress={this.handleKeyPress}
//           />
//         )}
//       </div>
//     );
//   }
// }

// export default Search;

// handleKeyPress = e => {
//   if (e.key === 'Enter') {
//     this.setCurrentUser();
//   }
// };
