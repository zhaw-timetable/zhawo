import globalStore from './GlobalStore';

import * as api from '../adapters/ZhawoAdapter';
import idbAdapter from '../adapters/IdbAdapter';

it('handleActions should be defined', () => {
  expect(globalStore).toBeDefined();
  expect(globalStore.handleActions).toBeDefined();
});

it('should have the initial values', () => {
  expect(globalStore.theme).toEqual('lightTheme');
  expect(globalStore.currentUser).toEqual('');
  expect(globalStore.currentUserType).toEqual('');
  expect(globalStore.possibleNames).toEqual([]);
  expect(globalStore.possibleLoginNames).toEqual([]);
  expect(globalStore.drawerOpen).toEqual(false);
  expect(globalStore.isDayView).toEqual(true);
});

it('handleActions with SET_CURRENT_USER should call setCurrentUser with correct paramaters', () => {
  const restore = globalStore.setCurrentUser;
  globalStore.setCurrentUser = jest.fn();
  const ACTION = {
    type: 'SET_CURRENT_USER',
    payload: { name: 'name', type: 'type' }
  };
  globalStore.handleActions(ACTION);
  expect(globalStore.setCurrentUser).toHaveBeenCalled();
  expect(globalStore.setCurrentUser).toHaveBeenCalledWith('name', 'type');
  globalStore.setCurrentUser = restore;
});

it('handleActions with TOGGLE_DRAWER should change drawerOpen', () => {
  const ACTION = {
    type: 'TOGGLE_DRAWER'
  };
  expect(globalStore.drawerOpen).toBe(false);
  globalStore.handleActions(ACTION);
  expect(globalStore.drawerOpen).toBe(true);
  globalStore.handleActions(ACTION);
  expect(globalStore.drawerOpen).toBe(false);
  globalStore.handleActions(ACTION);
  expect(globalStore.drawerOpen).toBe(true);
});

it('handleActions with GET_POSSIBLE_NAMES should update should call api.getPossibleNames and update store', async () => {
  const restore = api.getPossibleNames;
  api.getPossibleNames = jest.fn().mockImplementation(() => {
    return new Promise(resolve => {
      resolve({
        students: ['student'],
        lecturers: ['lecturer'],
        classes: ['class'],
        courses: ['course'],
        rooms: ['room']
      });
    });
  });
  const ACTION = {
    type: 'GET_POSSIBLE_NAMES'
  };
  expect(globalStore.possibleNames.length).toBe(0);
  expect(globalStore.possibleLoginNames.length).toBe(0);
  await globalStore.handleActions(ACTION);
  expect(api.getPossibleNames).toHaveBeenCalled();
  expect(globalStore.possibleNames.length).toBe(5);
  expect(globalStore.possibleLoginNames.length).toBe(2);
  api.getPossibleNames = restore;
});

it('handleActions with GET_POSSIBLE_NAMES should handle Error in Promise', async () => {
  const restore = api.getPossibleNames;
  const restore2 = console.error;
  console.error = jest.fn();
  api.getPossibleNames = jest.fn().mockImplementation(() => {
    return new Promise(resolve => {
      throw new Error();
    });
  });
  const ACTION = {
    type: 'GET_POSSIBLE_NAMES'
  };
  await globalStore.handleActions(ACTION);
  expect(console.error).toHaveBeenCalled();
  api.getPossibleNames = restore;
  console.error = restore2;
});

it('handleActions with LOGOUT should call removeCurrentUser', () => {
  const restore = globalStore.removeCurrentUser;
  globalStore.removeCurrentUser = jest.fn();
  const ACTION = {
    type: 'LOGOUT'
  };
  globalStore.handleActions(ACTION);
  expect(globalStore.removeCurrentUser).toHaveBeenCalled();
  globalStore.removeCurrentUser = restore;
});

it('handleActions with CHANGE_THEME should call setTheme', () => {
  const restore = globalStore.setTheme;
  globalStore.setTheme = jest.fn();
  const ACTION = {
    type: 'CHANGE_THEME'
  };
  globalStore.handleActions(ACTION);
  expect(globalStore.setTheme).toHaveBeenCalled();
  globalStore.setTheme = restore;
});

it('handleActions with SET_DAYVIEW should update store', () => {
  let ACTION = {
    type: 'SET_DAYVIEW',
    payload: false
  };
  expect(globalStore.isDayView).toBe(true);
  globalStore.handleActions(ACTION);
  expect(globalStore.isDayView).toBe(false);
  ACTION = {
    type: 'SET_DAYVIEW',
    payload: true
  };
  globalStore.handleActions(ACTION);
  expect(globalStore.isDayView).toBe(true);
});

it('setTheme should call setThemeInDB when called', () => {
  const restore = globalStore.setThemeInDB;
  globalStore.setThemeInDB = jest.fn();
  globalStore.setTheme(true);
  expect(globalStore.theme).toEqual('darkTheme');
  expect(globalStore.setThemeInDB).toHaveBeenCalledWith('darkTheme');
  globalStore.setTheme(false);
  expect(globalStore.theme).toEqual('lightTheme');
  expect(globalStore.setThemeInDB).toHaveBeenCalledWith('lightTheme');
  globalStore.setThemeInDB = restore;
});

it('getUserNameFromDB should call idbAdapter.getUsername()', async () => {
  const restore = idbAdapter.getUsername;
  idbAdapter.getUsername = jest.fn().mockImplementation(() => {
    return new Promise(resolve => {
      resolve({ username: 'username', type: 'usertype' });
    });
  });
  await globalStore.getUsernameFromDB();
  expect(idbAdapter.getUsername).toHaveBeenCalled();
  idbAdapter.getUsername = restore;
});

it('getThemeFromDB should call idbAdapter.getTheme() and update store', async () => {
  const restore = idbAdapter.getTheme;
  idbAdapter.getTheme = jest.fn().mockImplementation(() => {
    return new Promise(resolve => {
      resolve({ theme: 'theme' });
    });
  });
  await globalStore.getThemeFromDB();
  expect(globalStore.theme).toEqual('theme');
  expect(idbAdapter.getTheme).toHaveBeenCalled();
  idbAdapter.getTheme = jest.fn().mockImplementation(() => {
    return new Promise(resolve => {
      resolve();
    });
  });
  await globalStore.getThemeFromDB();
  expect(globalStore.theme).toEqual('theme');
  idbAdapter.getTheme = restore;
});

it('setThemeInDB should call idbAdapter.setTheme()', async () => {
  const restore = idbAdapter.setTheme;
  idbAdapter.setTheme = jest.fn().mockImplementation(theme => {
    return new Promise(resolve => {
      resolve();
    });
  });
  const PARAM = 'testparam';
  await globalStore.setThemeInDB(PARAM);
  expect(idbAdapter.setTheme).toHaveBeenCalled();
  expect(idbAdapter.setTheme).toHaveBeenCalledWith(PARAM);
  idbAdapter.setTheme = restore;
});

it('setCurrentUser should update store and call idbAdapter.setUser()', async () => {
  const restore = idbAdapter.setUser;
  idbAdapter.setUser = jest.fn().mockImplementation((name, type) => {
    return new Promise(resolve => {
      resolve();
    });
  });
  const NAME = 'name';
  const TYPE = 'type';
  await globalStore.setCurrentUser(NAME, TYPE);
  expect(globalStore.currentUser).toEqual(NAME);
  expect(globalStore.currentUserType).toEqual(TYPE);
  expect(idbAdapter.setUser).toHaveBeenCalled();
  expect(idbAdapter.setUser).toHaveBeenCalledWith(NAME, TYPE);
  idbAdapter.setUser = restore;
});

it('removeCurrentUser should update store and call idbAdapter.removeUser()', async () => {
  const restore = idbAdapter.removeUser;
  idbAdapter.removeUser = jest.fn().mockImplementation(() => {
    return new Promise(resolve => {
      resolve();
    });
  });
  globalStore.currentUser = 'name';
  globalStore.currentUserType = 'type';
  globalStore.drawerOpen = true;
  await globalStore.removeCurrentUser();
  expect(globalStore.currentUser).toEqual('');
  expect(globalStore.currentUserType).toEqual('');
  expect(globalStore.drawerOpen).toBe(false);
  expect(idbAdapter.removeUser).toHaveBeenCalled();
  idbAdapter.removeUser = restore;
});
