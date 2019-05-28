import React, { Component, Fragment } from 'react';
import './ScheduleContextMenu.sass';

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
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import TodayIcon from '@material-ui/icons/Today';
import ClearIcon from '@material-ui/icons/Clear';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';

/**
 * Schedule Context Menu Component
 *
 * @class ScheduleContextMenu
 * @extends {Component}
 */
class ScheduleContextMenu extends Component {
  state = {
    isScheduleSearchOpen: false,
    showInput: false,
    currentSearch: scheduleStore.currentSearch,
    value: '',
    suggestions: [],
    possibleNames: globalStore.possibleNames
  };

  componentWillMount() {
    globalStore.on('possible_names_changed', this.refreshPossibleNames);
    scheduleStore.on('schedule_changed', this.refreshState);
  }

  componentWillUnmount() {
    globalStore.removeListener(
      'possible_names_changed',
      this.refreshPossibleNames
    );
    scheduleStore.removeListener('schedule_changed', this.refreshState);
  }

  /**
   * Function called on store change.
   * Set local currentSearch state to match store.
   *
   * @memberof ScheduleContextMenu
   */
  refreshState = () => {
    this.setState({
      currentSearch: scheduleStore.currentSearch
    });
  };

  /**
   * Function that prevents the default behavior of an element and uses the gotoDay action to go to current day.
   *
   * @memberof ScheduleContextMenu
   */
  handleGoToTodayClick = e => {
    e.preventDefault();
    const currentDate = new Date();
    scheduleActions.gotoDay(currentDate);
  };

  /**
   * Function used to open Schedule Search by setting isScheduleSearchOpen state to true.
   *
   * @memberof ScheduleContextMenu
   */
  handleOpen = () => {
    this.setState({ isScheduleSearchOpen: true });
  };

  /**
   * Function used to close Schedule Search by setting isScheduleSearchOpen state to false.
   * Resets value state.
   *
   * @memberof ScheduleContextMenu
   */
  handleClose = () => {
    this.setState({ isScheduleSearchOpen: false, value: '' });
  };

  /**
   * Function clears search by calling clearSearch action
   *
   * @memberof ScheduleContextMenu
   */
  handleClearSearch = e => {
    scheduleActions.clearSearch();
  };

  /**
   * Function called on store change.
   * Sets local possibleNames to match store.
   *
   * @memberof ScheduleContextMenu
   */
  refreshPossibleNames = () => {
    this.setState({
      possibleNames: globalStore.possibleNames
    });
  };

  /**
   * Function used to set local suggestions state by calling getSuggestions.
   * Used by Autosuggest.
   *
   * @param {string} value
   * @memberof ScheduleContextMenu
   */
  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  /**
   * Function used to clear local suggestions state.
   * Used by Autosuggest.
   *
   * @memberof ScheduleContextMenu
   */
  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  /**
   * Function used to set local value state.
   * Used by Autosuggest.
   *
   * @memberof ScheduleContextMenu
   */
  handleChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  /**
   * Function called on every key press and prevents the default.
   * Selects suggestion on enter press using handleSearch.
   *
   *
   * @memberof ScheduleContextMenu
   */
  handleKeyDown = event => {
    if (event.key === 'Enter') {
      const { suggestions } = this.state;
      if (suggestions.length === 1) {
        event.preventDefault();
        this.handleSearch(suggestions[0]);
      }
    }
  };

  /**
   * Function that get schedule for search by calling getSchedule action and closes modular using handleClose.
   *
   * @memberof ScheduleContextMenu
   */
  handleSearch = search => {
    const { type, label } = search;
    scheduleActions.getSchedule(type, label, scheduleStore.displayDay);
    this.handleClose();
  };

  /**
   * Function that filters possibleNames by value.
   *
   * @param {string} value
   * @memberof ScheduleContextMenu
   */
  getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;
    return inputLength === 0
      ? []
      : this.state.possibleNames.filter(suggestion => {
          const matchesSuggestion = suggestion.label
            .toLowerCase()
            .includes(inputValue);
          const isNotCurrentUser = !(
            suggestion.label.toLowerCase().valueOf() ==
            globalStore.currentUser.toLowerCase().valueOf()
          );
          const keep = count < 5 && matchesSuggestion && isNotCurrentUser;
          if (keep) {
            count += 1;
          }
          return keep;
        });
  };

  /**
   * Function that get suggestion value from given suggestion
   *
   * @memberof ScheduleContextMenu
   */
  getSuggestionValue = suggestion => {
    return suggestion.label;
  };

  /**
   * Function that selects suggestion using handleSearch.
   * Prevents Default.
   *
   * @memberof ScheduleContextMenu
   */
  onSuggestionSelected = (event, { suggestion }) => {
    event.preventDefault();
    this.handleSearch(suggestion);
  };

  render() {
    return (
      <Fragment>
        <IconButton
          aria-owns={this.state.isScheduleSearchOpen ? 'menu-appbar' : null}
          aria-haspopup="true"
          onClick={this.handleGoToTodayClick}
          color="inherit"
        >
          <TodayIcon />
        </IconButton>
        {!this.state.currentSearch && (
          <IconButton
            aria-owns={this.state.isScheduleSearchOpen ? 'menu-appbar' : null}
            aria-haspopup="true"
            onClick={this.handleOpen}
            color="inherit"
          >
            <SearchIcon />
          </IconButton>
        )}
        {this.state.currentSearch && (
          <Button
            onClick={this.handleClearSearch}
            color="inherit"
            variant="text"
            fontSize="small"
          >
            {scheduleStore.currentSearch}
            <ClearIcon id="SearchClearIcon" />
          </Button>
        )}
        <Dialog
          open={this.state.isScheduleSearchOpen}
          TransitionComponent={Transition}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
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
                onChange: this.handleChange,
                onKeyDown: this.handleKeyDown
              }}
            />
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

export default ScheduleContextMenu;

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

const Transition = props => {
  return <Slide direction="down" {...props} />;
};
