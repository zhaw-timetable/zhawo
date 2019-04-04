jest.mock('../../../../stores/GlobalStore');
jest.mock('../../../../stores/ScheduleStore');
jest.mock('../../../../adapters/IdbAdapter');
jest.mock('../../../../adapters/ZhawoAdapter');

import globalStore from '../../../../stores/GlobalStore';
import * as globalActions from '../../../../actions/GlobalActions';

import scheduleStore from '../../../../stores/ScheduleStore';
import * as scheduleActions from '../../../../actions/ScheduleActions';

import ScheduleContextMenu from './ScheduleContextMenu';

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

it('renders without crashing', () => {
  shallow(<ScheduleContextMenu />);
});

it('refreshState should update state with correct value from scheduleStore', () => {
  const wrapper = shallow(<ScheduleContextMenu />);
  const instance = wrapper.instance();
  scheduleStore.currentSearch = 'testSearch';
  instance.setState = jest.fn();
  instance.refreshState();
  expect(instance.setState).toHaveBeenCalledWith({
    currentSearch: 'testSearch'
  });
});

it('handleOpen should update state with correct value', () => {
  const wrapper = shallow(<ScheduleContextMenu />);
  const instance = wrapper.instance();
  instance.setState = jest.fn();
  instance.handleOpen();
  expect(instance.setState).toHaveBeenCalledWith({
    isScheduleSearchOpen: true
  });
});

it('handleClose should update state with correct value', () => {
  const wrapper = shallow(<ScheduleContextMenu />);
  const instance = wrapper.instance();
  instance.setState = jest.fn();
  instance.handleClose();
  expect(instance.setState).toHaveBeenCalledWith({
    isScheduleSearchOpen: false,
    value: ''
  });
});

it('handleClearSearch should update state with correct value', () => {
  const wrapper = shallow(<ScheduleContextMenu />);
  const instance = wrapper.instance();
  scheduleActions.clearSearch = jest.fn();
  instance.handleClearSearch('event');
  expect(scheduleActions.clearSearch).toHaveBeenCalled();
});

it('should call setState with the correct value via refreshPossibleNames', () => {
  const wrapper = shallow(<ScheduleContextMenu />);
  const instance = wrapper.instance();
  globalStore.possibleNames = ['vissejul'];
  instance.setState = jest.fn();
  instance.refreshPossibleNames();
  expect(instance.setState).toHaveBeenCalledWith({
    possibleNames: ['vissejul']
  });
});

it('should call setState with the correct value via handleSuggestionsFetchRequested', () => {
  const wrapper = shallow(<ScheduleContextMenu />);
  const instance = wrapper.instance();
  let temp = ['bachmdo2', 'vissejul'];
  instance.getSuggestions = jest.fn().mockImplementation(({ value }) => {
    return temp;
  });
  instance.setState = jest.fn();
  instance.handleSuggestionsFetchRequested({ value: 'visse' });
  expect(instance.setState).toHaveBeenCalledWith({
    suggestions: ['bachmdo2', 'vissejul']
  });
});

it('should call setState with the correct value via handleSuggestionsClearRequested', () => {
  const wrapper = shallow(<ScheduleContextMenu />);
  const instance = wrapper.instance();
  instance.setState = jest.fn();
  instance.handleSuggestionsClearRequested();
  expect(instance.setState).toHaveBeenCalledWith({
    suggestions: []
  });
});

it('handleGoToTodayClick should preventDefault and call scheduleActions.gotoDay with current date', () => {
  const wrapper = shallow(<ScheduleContextMenu />);
  const instance = wrapper.instance();
  scheduleActions.gotoDay = jest.fn();
  const preventDefaultMock = jest.fn();
  instance.handleGoToTodayClick({ preventDefault: preventDefaultMock });
  expect(scheduleActions.gotoDay).toHaveBeenCalled();
  expect(preventDefaultMock).toHaveBeenCalled();
});

it('handleChange should update state with newValue', () => {
  const wrapper = shallow(<ScheduleContextMenu />);
  const instance = wrapper.instance();
  instance.setState = jest.fn();
  instance.handleChange('event', { newValue: 'searchValue' });
  expect(instance.setState).toHaveBeenCalledWith({ value: 'searchValue' });
});

it('getSuggestions should return array with suggestions based on possibleNames in state', () => {
  const wrapper = shallow(<ScheduleContextMenu />);
  const instance = wrapper.instance();
  const allPossibleNames = [
    { label: 'bachmdo2', type: 'student' },
    { label: 'bachdomi', type: 'student' }
  ];
  const matchingPossibleNames = [{ label: 'bachmdo2', type: 'student' }];
  instance.state.possibleNames = allPossibleNames;
  let returnedArray = instance.getSuggestions('b');
  expect(returnedArray).toEqual(allPossibleNames);
  returnedArray = instance.getSuggestions('bachm');
  expect(returnedArray).toEqual(matchingPossibleNames);
  returnedArray = instance.getSuggestions('');
  expect(returnedArray).toEqual([]);
});

it('getSuggestionValue should return label of provided suggestion', () => {
  const wrapper = shallow(<ScheduleContextMenu />);
  const instance = wrapper.instance();
  let returnValue = instance.getSuggestionValue({ label: 'bachmdo2' });
  expect(returnValue).toEqual('bachmdo2');
});

it('onSuggestionSelected should call handleClose and scheduleActions.getSchedule with right parameters', () => {
  const wrapper = shallow(<ScheduleContextMenu />);
  const instance = wrapper.instance();
  scheduleStore.displayDay = 'fakeDisplayDay';
  instance.handleClose = jest.fn();
  scheduleActions.getSchedule = jest.fn();
  instance.onSuggestionSelected(
    { preventDefault: jest.fn() },
    { suggestion: { label: 'bachmdo2', type: 'student' } }
  );
  expect(instance.handleClose).toHaveBeenCalled();
  expect(scheduleActions.getSchedule).toHaveBeenCalledWith(
    'student',
    'bachmdo2',
    'fakeDisplayDay'
  );
});
