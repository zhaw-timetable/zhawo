jest.mock('../../../../adapters/IdbAdapter');
jest.mock('../../../../adapters/ZhawoAdapter');
jest.mock('../../../../stores/GlobalStore');
jest.mock('../../../../actions/GlobalActions');
jest.mock('../../../../stores/ScheduleStore');
jest.mock('../../../../actions/ScheduleActions');

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import globalStore from '../../../../stores/GlobalStore';
import * as globalActions from '../../../../actions/GlobalActions';

import scheduleStore from '../../../../stores/ScheduleStore';
import * as scheduleActions from '../../../../actions/ScheduleActions';

import LoginSearch from './LoginSearch';

const wrapper = shallow(<LoginSearch />);
const instance = wrapper.instance();

it('renders without crashing', () => {});

it('should render one root element with className LoginSearch', () => {
  expect(wrapper.find('.LoginSearch')).toHaveLength(1);
});

it('should get and then return suggestions', () => {
  instance.state.possibleLoginNames = [
    { label: 'bachmado2' },
    { label: 'vissejul' }
  ];

  let temp = instance.getSuggestions('visse');

  expect(temp).toEqual([
    {
      label: 'vissejul'
    }
  ]);

  temp = instance.getSuggestions('vissela');

  expect(temp).toEqual([]);
});

it('should only reload if globalStore doesnt have PossibleNames yet', () => {
  instance.setState = jest.fn();
  globalActions.getPossibleNames = jest.fn();
  let temp = {
    loadingPossibleNames: false
  };

  globalStore.possibleNames = [];
  instance.loadPossibleNames();
  expect(globalActions.getPossibleNames).toHaveBeenCalled();

  globalStore.possibleNames = [1, 2];
  instance.loadPossibleNames();
  expect(instance.setState).toHaveBeenCalledWith(temp);
});

it('should call refreshPossibleLoginNames with correct values ', () => {
  globalStore.possibleLoginNames = ['bachmado2', 'vissejul'];
  instance.setState = jest.fn();
  let temp = {
    loadingPossibleNames: false,
    possibleLoginNames: ['bachmado2', 'vissejul']
  };
  instance.refreshPossibleLoginNames();
  expect(instance.setState).toHaveBeenCalled();
});

it('should call handleSuggestionsFetchRequested with correct values ', () => {
  instance.setState = jest.fn();

  let temp = ['bachmado2', 'vissejul'];
  let name;
  instance.getSuggestions = jest.fn().mockImplementation(({ value }) => {
    return temp;
  });

  instance.getSuggestions({ value: 'visse' });
  instance.handleSuggestionsFetchRequested({ value: 'visse' });
  expect(instance.getSuggestions).toHaveBeenCalledWith({ value: 'visse' });
  expect(instance.setState).toHaveBeenCalledWith({ suggestions: temp });
});

it('should call handleSuggestionsClearRequested with correct values ', () => {
  instance.setState = jest.fn();
  let temp = {
    suggestions: []
  };
  instance.handleSuggestionsClearRequested();
  expect(instance.setState).toHaveBeenCalledWith(temp);
});

it('should call handleChange with correct values ', () => {
  instance.setState = jest.fn();
  instance.handleChange(null, { newValue: 'test', method: 'method' });
  expect(instance.setState).toHaveBeenCalledWith({ value: 'test' });
});

it('should call getSuggestions with correct values and return correct values ', () => {
  instance.state.possibleLoginNames = ['bachmado2', 'vissejul'];
  instance.setState = jest.fn();
  let res = instance.getSuggestions('visse');

  expect(res).toEqual(['bachmado2', 'vissejul']);
});

it('should call onSuggestionSelected with correct values and return correct values ', () => {
  let suggestion = {
    type: 'students',
    label: 'vissejul'
  };
  scheduleStore.displayDay = '17.07.1994';
  globalActions.setCurrentUser = jest.fn();
  scheduleActions.getSchedule = jest.fn();
  instance.onSuggestionSelected(null, { suggestion });
  expect(globalActions.setCurrentUser).toHaveBeenCalledWith(
    suggestion.label,
    suggestion.type
  );
  expect(scheduleActions.getSchedule).toHaveBeenCalledWith(
    suggestion.type,
    suggestion.label,
    '17.07.1994'
  );
});

it('should call setState from refreshPossibleLoginNames', () => {
  globalStore.possibleLoginNames = ['bachmado2', 'vissejul'];
  instance.setState = jest.fn();

  instance.refreshPossibleLoginNames();

  expect(instance.setState).toHaveBeenCalledWith({
    loadingPossibleNames: false,
    possibleLoginNames: ['bachmado2', 'vissejul']
  });
});

it('should call actions to log in user', () => {
  let user = { type: 'student', label: 'vissejul' };

  scheduleStore.displayDay = '2018-10-29';

  globalActions.setCurrentUser = jest.fn();
  scheduleActions.getSchedule = jest.fn();

  instance.loginUser(user);

  expect(globalActions.setCurrentUser).toHaveBeenCalledWith(
    'vissejul',
    'student'
  );
  expect(scheduleActions.getSchedule).toHaveBeenCalledWith(
    'student',
    'vissejul',
    '2018-10-29'
  );
});

it('should call login user on enter press if only 1 suggestion left', () => {
  let event = { key: 'Enter' };

  instance.loginUser = jest.fn();
  instance.state.suggestions = ['test', 'test'];

  instance.handleKeyDown(event);
  expect(instance.loginUser).not.toHaveBeenCalled();

  instance.state.suggestions = ['test'];

  instance.handleKeyDown(event);
  expect(instance.loginUser).toHaveBeenCalledWith('test');

  instance.loginUser.mockRestore();
});

it('should remove listeners before unmount', () => {
  globalStore.removeListener = jest.fn();

  wrapper.unmount();

  expect(globalStore.removeListener).toHaveBeenCalled();
});
