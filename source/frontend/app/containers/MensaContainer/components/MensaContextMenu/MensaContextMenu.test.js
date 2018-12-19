import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import mensaStore from '../../../../stores/MensaStore';
import * as mensaActions from '../../../../actions/MensaActions';

import MensaContextMenu from './MensaContextMenu';

const wrapper = shallow(<MensaContextMenu />);
const instance = wrapper.instance();

jest.mock('../../../../stores/MensaStore');
jest.mock('../../../../actions/MensaActions');

it('renders without crashing', () => {});

it('should call setState via handleClick with correct values ', () => {
  instance.setState = jest.fn();

  let event = {
    currentTarget: 'test'
  };

  instance.handleClick(event);
  expect(instance.setState).toHaveBeenCalledWith({ anchorEl: 'test' });
});

it('should call setState via handleClose with correct values ', () => {
  instance.setState = jest.fn();

  instance.handleClose();
  expect(instance.setState).toHaveBeenCalledWith({ anchorEl: null });
});

it('should call setState via handleMensasLoaded with correct values ', () => {
  mensaStore.allMensas = ['mensa1', 'mensa2'];
  mensaStore.selectedMensaName = 'mensa1';
  instance.setState = jest.fn();

  instance.handleMensasLoaded();
  expect(instance.setState).toHaveBeenCalledWith({
    allMensas: ['mensa1', 'mensa2'],
    selectedMensaName: 'mensa1'
  });
});
