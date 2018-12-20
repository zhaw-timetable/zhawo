import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

import { format } from 'date-fns';

import dispatcher from '../dispatcher';

configure({ adapter: new Adapter() });

import vszhawStore from './VszhawStore';

it('handleActions should be defined', () => {
  expect(vszhawStore).toBeDefined();
  expect(vszhawStore.handleActions).toBeDefined();
});

it('should have the initial values', () => {
  expect(vszhawStore.feed).toEqual('');
});
