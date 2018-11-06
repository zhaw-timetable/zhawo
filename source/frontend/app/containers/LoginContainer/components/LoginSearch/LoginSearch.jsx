import React, { Component, Fragment } from 'react';
import './LoginSearch.sass';

import globalStore from '../../../../stores/GlobalStore';
import * as globalActions from '../../../../actions/GlobalActions';

import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';

class LoginSearch extends Component {
  state = {
    value: '',
    suggestions: [],
    loadingPossibleNames: true,
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
    } else {
      this.setState({
        loadingPossibleNames: false
      });
    }
  }

  refreshPossibleLoginNames = () => {
    this.setState({
      loadingPossibleNames: false,
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

  //TODO: clean this with proper function and value from state
  getSuggestionValue = suggestion => {
    globalActions.setCurrentUser(suggestion.label, suggestion.type);
    return suggestion.label;
  };

  render() {
    return (
      <div className="LoginSearch">
        {!this.state.loadingPossibleNames && (
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
              onChange: this.handleChange,
              setCurrentUser: this.setCurrentUser
            }}
          />
        )}
        {this.state.loadingPossibleNames && (
          <div className="LoadIndicator">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        )}
      </div>
    );
  }
}

export default LoginSearch;

function renderInput(inputProps) {
  const { ref, setCurrentUser, ...other } = inputProps;

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