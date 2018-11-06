import React, { Component, Fragment } from 'react';

import globalStore from '../../../../stores/GlobalStore';
import * as globalActions from '../../../../actions/GlobalActions';

import scheduleStore from '../../../../stores/ScheduleStore';
import * as scheduleActions from '../../../../actions/ScheduleActions';

import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

//TODO: clean this up!

// const styles = theme => ({
//   container: {
//     flexGrow: 1,
//     position: 'relative',
//     height: 250
//   },
//   suggestionsContainerOpen: {
//     position: 'absolute',
//     zIndex: 1,
//     marginTop: theme.spacing.unit,
//     left: 0,
//     right: 0
//   },
//   suggestion: {
//     display: 'block'
//   },
//   suggestionsList: {
//     margin: 0,
//     padding: 0,
//     listStyleType: 'none'
//   }
// });

class ScheduleSearch extends Component {
  state = {
    value: '',
    suggestions: [],
    locked: true,
    possibleNames: globalStore.possibleNames
  };

  componentWillMount() {
    globalStore.on('possible_names_changed', this.refreshPossibleNames);
  }

  componentWillUnmount() {
    globalStore.removeListener(
      'possible_names_changed',
      this.refreshPossibleNames
    );
  }

  refreshPossibleNames = () => {
    this.setState({
      possibleNames: globalStore.possibleNames
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
      value: newValue,
      locked: true
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
      : this.state.possibleNames.filter(suggestion => {
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
    // this.setState({
    //   suggestionValue: suggestion,
    //   locked: false
    // });
    // console.log(suggestion.type, suggestion.label, scheduleStore.displayDay);
    scheduleActions.getSchedule(
      suggestion.type,
      suggestion.label,
      scheduleStore.displayDay
    );
    this.props.handleClose();
    return suggestion.label;
  };

  handleEnter = e => {
    // if (!this.state.locked) {
    //   scheduleActions.getSchedule(
    //     'students',
    //     this.state.value,
    //     scheduleStore.di
    //   );
    // }
    // const currentDate = new Date();
    // scheduleActions.getSchedule('students', value, currentDate);
    console.log(this.state.value);
  };

  render() {
    const { handleClose } = this.props;

    // theme={{
    //   container: classes.container,
    //   suggestionsContainerOpen: classes.suggestionsContainerOpen,
    //   suggestionsList: classes.suggestionsList,
    //   suggestion: classes.suggestion
    // }}

    return (
      <DialogContent className="ScheduleSearch">
        <Autosuggest
          renderInputComponent={renderInput}
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
          renderSuggestionsContainer={renderSuggestionsContainer}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={{
            placeholder: 'Nach Kürzel suchen',
            value: this.state.value,
            onChange: this.handleChange
          }}
        />
      </DialogContent>
    );
  }
}

// IntegrationAutosuggest.propTypes = {
//   classes: PropTypes.object.isRequired
// };

// export default withStyles(styles)(IntegrationAutosuggest);
export default ScheduleSearch;

function renderInput(inputProps) {
  const { ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: ref,
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
