import React, { Component, Fragment } from 'react';
import './ScheduleSearch.sass';

import globalStore from '../../../../stores/GlobalStore';
import * as globalActions from '../../../../actions/GlobalActions';

import scheduleStore from '../../../../stores/ScheduleStore';
import * as scheduleActions from '../../../../actions/ScheduleActions';

import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import DialogContent from '@material-ui/core/DialogContent';

class ScheduleSearch extends Component {
  state = {
    value: '',
    suggestions: [],
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
      value: newValue
    });
  };

  getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;
    return inputLength === 0
      ? []
      : this.state.possibleNames.filter(suggestion => {
          const keep =
            count < 5 && suggestion.label.toLowerCase().includes(inputValue);
          if (keep) {
            count += 1;
          }
          return keep;
        });
  };

  getSuggestionValue = suggestion => {
    return suggestion.label;
  };

  onSuggestionSelected = (event, { suggestion }) => {
    event.preventDefault();
    this.props.handleClose();
    scheduleActions.getSchedule(
      suggestion.type,
      suggestion.label,
      scheduleStore.displayDay
    );
  };

  render() {
    const { handleClose } = this.props;
    return (
      <DialogContent className="ScheduleSearch">
        <Autosuggest
          renderInputComponent={Input}
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
          renderSuggestionsContainer={SuggestionsContainer}
          renderSuggestion={Suggestion}
          getSuggestionValue={this.getSuggestionValue}
          onSuggestionSelected={this.onSuggestionSelected}
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

export default ScheduleSearch;

const Input = inputProps => {
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
};

const Suggestion = (suggestion, { query, isHighlighted }) => {
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
};

const SuggestionsContainer = options => {
  const { containerProps, children } = options;
  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
};
