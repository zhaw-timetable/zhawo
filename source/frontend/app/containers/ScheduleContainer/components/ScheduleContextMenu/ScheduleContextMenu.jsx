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

  refreshState = () => {
    this.setState({
      currentSearch: scheduleStore.currentSearch
    });
  };

  handleGoToTodayClick = e => {
    e.preventDefault();
    const currentDate = new Date();
    scheduleActions.gotoDay(currentDate);
  };

  toggleShowInput = () => {
    this.setState({ isScheduleSearchOpen: true });
  };

  handleClickOpen = () => {
    this.setState({ isScheduleSearchOpen: true });
  };

  handleClose = () => {
    this.setState({ isScheduleSearchOpen: false });
  };

  handleClearSearch = e => {
    scheduleActions.clearSearch();
  };

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
    this.handleClose();
    scheduleActions.getSchedule(
      suggestion.type,
      suggestion.label,
      scheduleStore.displayDay
    );
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
            onClick={this.toggleShowInput}
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
            className="SearchClearButton"
          >
            {scheduleStore.currentSearch}
            <ClearIcon id="SearchClearIcon" />
          </Button>
        )}
        <Dialog
          open={this.state.isScheduleSearchOpen}
          TransitionComponent={Transition}
          keepMounted
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
                onChange: this.handleChange
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