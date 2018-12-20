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

it('should call refreshPossibleLoginNames with correct values ', () => {
  globalStore.possibleLoginNames = ['bachmado2', 'vissejul'];
  instance.setState = jest.fn();
  let temp = {
    loadingPossibleNames: false,
    possibleLoginNames: ['bachmado2', 'vissejul']
  };
  instance.refreshPossibleLoginNames();
  expect(instance.setState).toHaveBeenCalledWith(temp);
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

// it('should call handleChange with correct values ', () => {
//   instance.setState = jest.fn();
//   instance.handleChange(null, 'test');
//   // TODO: ka wieso undifiend
//   expect(instance.setState).toHaveBeenCalledWith({ value: 'test' });
// });

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
