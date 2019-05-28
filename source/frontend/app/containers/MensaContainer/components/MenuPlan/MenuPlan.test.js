jest.mock('../../../../adapters/IdbAdapter');
jest.mock('../../../../adapters/ZhawoAdapter');
jest.mock('../../../../stores/GlobalStore');
jest.mock('../../../../actions/GlobalActions');
jest.mock('../../../../stores/ScheduleStore');
jest.mock('../../../../actions/ScheduleActions');
jest.mock('../../../../stores/RoomSearchStore');

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import MenuPlan from './MenuPlan';

import mensaStore from '../../../../stores/MensaStore';
import * as mensaActions from '../../../../actions/MensaActions';

const wrapper = shallow(<MenuPlan />);
const instance = wrapper.instance();

it('renders without crashing', () => {});

it('should render one root element with className MenuPlan', () => {
  expect(wrapper.find('.MenuPlan')).toHaveLength(1);
});

it('should call setState with right values from handleMenuPlanChanged', () => {
  let temp = {
    currentMenuDay: 'currentMenuDay',
    emptyMenuMessage: 'emptyMenuMessage',
    selectedMensaName: 'selectedMensaName'
  };
  mensaStore.currentMenuDay = 'currentMenuDay';
  mensaStore.emptyMenuMessage = 'emptyMenuMessage';
  mensaStore.selectedMensaName = 'selectedMensaName';

  instance.setState = jest.fn();

  instance.handleMenuPlanChanged();

  expect(instance.setState).toHaveBeenCalledWith(temp);
});

it('should remove listeners before unmount', () => {
  mensaStore.removeListener = jest.fn();

  wrapper.unmount();

  expect(mensaStore.removeListener).toHaveBeenCalled();
});
