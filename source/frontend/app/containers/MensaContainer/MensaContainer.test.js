import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import mensaStore from '../../stores/MensaStore';

import MensaContainer from './MensaContainer';

const wrapper = shallow(<MensaContainer />);
const instance = wrapper.instance();

jest.mock('../../stores/GlobalStore');
jest.mock('../../actions/GlobalActions');
jest.mock('../../stores/ScheduleStore');
jest.mock('../../actions/ScheduleActions');

it('renders without crashing', () => {});

it('should render one root element with className MensaContainer', () => {
  expect(wrapper.find('.MensaContainer')).toHaveLength(1);
});

it('should call setState via handleMenuPlanChanged with correct values ', () => {
  mensaStore.currentMenuDay = '17.07.1994';
  instance.setState = jest.fn();

  instance.handleMenuPlanChanged();
  expect(instance.setState).toHaveBeenCalledWith({
    currentMenuDay: '17.07.1994'
  });
});
