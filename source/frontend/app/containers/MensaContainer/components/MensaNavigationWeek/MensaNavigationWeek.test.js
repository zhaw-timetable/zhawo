import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

import mensaStore from '../../../../stores/MensaStore';
import * as mensaActions from '../../../../actions/MensaActions';

configure({ adapter: new Adapter() });

import MensaNavigationWeek from './MensaNavigationWeek';

const wrapper = shallow(<MensaNavigationWeek />);
const instance = wrapper.instance();

jest.mock('../../../../stores/MensaStore');
jest.mock('../../../../actions/MensaActions');

beforeEach(() => {
  console.log = jest.fn();
});

it('renders without crashing', () => {});

it('should call setState from refreshNavigation', () => {
  instance.setState = jest.fn();
  mensaStore.displayDay = 'day';
  mensaStore.displayWeek = ['day', 'day'];

  instance.refreshNavigation();

  expect(instance.setState).toHaveBeenCalledWith({
    displayDay: 'day',
    displayWeek: ['day', 'day']
  });
});

it('should gototoday on handleDateClick', () => {
  let tempParam = 'day';

  mensaActions.gotoDay = jest.fn();

  instance.handleDateClick(tempParam)(null);
  expect(mensaActions.gotoDay).toHaveBeenCalledWith(tempParam);
});

it('should gototoday a week before on handleWeekBackClick', () => {
  instance.state.displayDay = '2019-05-14T12:21:07.894Z';

  mensaActions.gotoDay = jest.fn();

  instance.handleWeekBackClick(null);
  expect(mensaActions.gotoDay).toHaveBeenCalledWith(
    new Date('2019-05-07T12:21:07.894Z')
  );
});

it('should gototoday a week before on handleWeekForwardClick', () => {
  instance.state.displayDay = '2019-05-14T12:21:07.894Z';

  mensaActions.gotoDay = jest.fn();

  instance.handleWeekForwardClick(null);
  expect(mensaActions.gotoDay).toHaveBeenCalledWith(
    new Date('2019-05-21T12:21:07.894Z')
  );
});

it('should remove listeners before unmount', () => {
  mensaStore.removeListener = jest.fn();

  wrapper.unmount();

  expect(mensaStore.removeListener).toHaveBeenCalled();
});
