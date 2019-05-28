import React, { Component, Fragment } from 'react';
import './LoginSearch.sass';

import scheduleStore from '../../../../stores/ScheduleStore';
import * as scheduleActions from '../../../../actions/ScheduleActions';

import globalStore from '../../../../stores/GlobalStore';
import * as globalActions from '../../../../actions/GlobalActions';

import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';

/**
 * Login Search Component.
 *
 * Maintains a list of all the possible User names.
 * Filters list when user types.
 * Login User and forwards to next Component.
 * Chooses top name in list on enter press.
 *
 * @class LoginSearch
 * @extends {Component}
 */

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

  /**
   * componentDidMount Function is called when the component is finished rendering.
   * loadPossibleNames Function is called form this function, so that the possible username list is ready for the users when they start typing.
   *
   * @memberof LoginSearch
   */
  componentDidMount() {
    this.loadPossibleNames();
  }

  /**
   * Function calls for possible usernames to be called, if store does not contain names yet.
   *
   * If store does contain names it set loadingPossibleNames state to false, so that the Autosuggest component is shown and not the 3 dots.
   *
   * @memberof LoginSearch
   */
  loadPossibleNames = () => {
    if (globalStore.possibleNames.length === 0) {
      globalActions.getPossibleNames();
    } else {
      this.setState({
        loadingPossibleNames: false
      });
    }
  };

  /**
   * Function that is called when store changes.
   * Sets local possibleLoginNames state to match store possibleLoginNames state.
   *
   * Set loadingPossibleNames state to false, so that the Autosuggest component is shown and no longer the 3 dots.
   *
   * @memberof LoginSearch
   */
  refreshPossibleLoginNames = () => {
    this.setState({
      loadingPossibleNames: false,
      possibleLoginNames: globalStore.possibleLoginNames
    });
  };

  /**
   * Function that is called when store changes.
   * Set local suggestions state by calling getSuggestions function.
   *
   * @memberof LoginSearch
   */
  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  /**
   * Function that clears local suggestions state.
   * Called on Autosuggest onSuggestionsClearRequested.
   *
   * @memberof LoginSearch
   */
  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  /**
   * Function called on Autosuggest component cahnge.
   *
   * sets local value state to match Autosuggest value.
   *
   * @memberof LoginSearch
   */
  handleChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
  };

  /**
   * Function called on every key press in Autosuggest.
   * Checks if key press was enter.
   * If enter was pressed it sets the user using loginUser function.
   *
   * @param {event} event
   * @memberof LoginSearch
   */
  handleKeyDown = event => {
    if (event.key === 'Enter') {
      const { suggestions } = this.state;
      if (suggestions.length === 1) {
        this.loginUser(suggestions[0]);
      }
    }
  };

  /**
   * User Object
   * @typedef {Object} User
   * @property {string} type
   * @property {string} label
   */
  /**
   * Function called to to login user.
   * Sets current user by calling setCurrentUser action.
   * Gets user schedule using getSchedule action.
   *
   * @param {User} user
   * @memberof LoginSearch
   */
  loginUser = user => {
    const { type, label } = user;
    globalActions.setCurrentUser(label, type);
    scheduleActions.getSchedule(type, label, scheduleStore.displayDay);
  };

  /**
   * Function filters possibleLoginNames with input.
   * Returns list of names.
   *
   * @param {string} value
   * @memberof LoginSearch
   */
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

  /**
   * Function called by Autosuggest.
   * return suggestion.
   *
   * @memberof LoginSearch
   */
  getSuggestionValue = suggestion => {
    return suggestion.label;
  };

  /**
   * Function called by Autosuggest on list element selection.
   * Login user using loginUser.
   *
   * @memberof LoginSearch
   */
  onSuggestionSelected = (event, { suggestion }) => {
    this.loginUser(suggestion);
  };

  render() {
    return (
      <div className="LoginSearch">
        {!this.state.loadingPossibleNames && (
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
              onChange: this.handleChange,
              onKeyDown: this.handleKeyDown
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

/**
 * Input functional Component.
 * Used in Autosuggest.
 * @param {*} inputProps
 */
const Input = inputProps => {
  const { ref, ...other } = inputProps;
  return (
    <TextField
      autoFocus
      fullWidth
      InputProps={{
        inputRef: ref,
        ...other
      }}
    />
  );
};

/**
 * Suggestion functional Component
 * Displays passed list of suggestion in a Menu List.
 * Highlights selected element.
 * @param {*} suggestion
 * @param {*} param1
 */
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

/**
 * SuggestionsContainer functional Component
 * Used to hold and display Suggestions in Autosuggest.
 * @param {*} options
 */
const SuggestionsContainer = options => {
  const { containerProps, children } = options;
  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
};
