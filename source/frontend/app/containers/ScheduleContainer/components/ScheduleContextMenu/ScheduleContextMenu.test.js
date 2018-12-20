import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import globalStore from '../../../../stores/GlobalStore';
import * as globalActions from '../../../../actions/GlobalActions';

import scheduleStore from '../../../../stores/ScheduleStore';
import * as scheduleActions from '../../../../actions/ScheduleActions';

import ScheduleContextMenu from './ScheduleContextMenu';

const wrapper = shallow(<ScheduleContextMenu />);
const instance = wrapper.instance();

beforeEach(() => {
  console.log = jest.fn();
});

it('renders without crashing', () => {});

it('should call setState with the correct value via refreshState', () => {
  scheduleStore.currentSearch = 'test';

  instance.setState = jest.fn();

  instance.refreshState();
  expect(instance.setState).toHaveBeenCalledWith({
    currentSearch: 'test'
  });
});

it('should call setState with the correct value via handleOpen', () => {
  instance.setState = jest.fn();
  instance.handleOpen();
  expect(instance.setState).toHaveBeenCalledWith({
    isScheduleSearchOpen: true
  });
});

it('should call setState with the correct value via handleClose', () => {
  instance.setState = jest.fn();

  instance.handleClose();
  expect(instance.setState).toHaveBeenCalledWith({
    isScheduleSearchOpen: false,
    value: ''
  });
});

it('should call setState with the correct value via handleClearSearch', () => {
  scheduleActions.clearSearch = jest.fn();

  instance.handleClearSearch(null);
  expect(scheduleActions.clearSearch).toHaveBeenCalled();
});

it('should call setState with the correct value via refreshPossibleNames', () => {
  globalStore.possibleNames = ['vissejul'];
  instance.setState = jest.fn();

  instance.refreshPossibleNames();
  expect(instance.setState).toHaveBeenCalledWith({
    possibleNames: ['vissejul']
  });
});

it('should call setState with the correct value via handleSuggestionsFetchRequested', () => {
  let temp = ['bachmado2', 'vissejul'];
  instance.getSuggestions = jest.fn().mockImplementation(({ value }) => {
    return temp;
  });
  instance.setState = jest.fn();

  instance.handleSuggestionsFetchRequested({ value: 'visse' });
  expect(instance.setState).toHaveBeenCalledWith({
    suggestions: ['bachmado2', 'vissejul']
  });
});

it('should call setState with the correct value via handleSuggestionsClearRequested', () => {
  instance.setState = jest.fn();
  instance.handleSuggestionsClearRequested();

  expect(instance.setState).toHaveBeenCalledWith({
    suggestions: []
  });
});
