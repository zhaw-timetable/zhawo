import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';
import idb from 'idb';

import * as api from '../adapters/ZhawoAdapter';

class GlobalStore extends EventEmitter {
  constructor() {
    super();
    this.theme = 'lightTheme';

    this.currentUser = '';
    this.currentUserType = '';
    this.possibleNames = [];
    this.possibleLoginNames = [];
    this.drawerOpen = false;
    this.isDayView = true;
    this.getUsernameFromDB();
    this.getThemeFromDB();
  }

  async handleActions(action) {
    switch (action.type) {
      case 'SET_CURRENT_USER':
        this.currentUser = action.payload.name;
        this.currentUserType = action.payload.type;
        this.setCurrentUser(action.payload.name, action.payload.type);
        this.emit('current_user_changed');
        break;
      case 'TOGGLE_DRAWER':
        this.drawerOpen = !this.drawerOpen;
        this.emit('drawerOpen_changed');
        break;
      case 'GET_POSSIBLE_NAMES':
        const possibleNames = await api.getPossibleNames().catch(err => {
          console.error(err);
        });
        this.possibleNames = [
          ...possibleNames.students,
          ...possibleNames.lecturers,
          ...possibleNames.classes,
          ...possibleNames.courses,
          ...possibleNames.rooms
        ];
        this.possibleLoginNames = [
          ...possibleNames.students,
          ...possibleNames.lecturers
        ];
        this.emit('possible_names_changed');
        break;

      case 'LOGOUT':
        this.drawerOpen = false;
        this.currentUser = '';
        this.currentUserType = '';
        this.removeCurrentUser();
        this.emit('current_user_loggedout');
        break;

      case 'CHANGE_THEME':
        this.setTheme(action.payload);
        this.emit('theme_changed');
        break;

      case 'SET_DAYVIEW':
        this.isDayView = action.payload;
        this.emit('isDayView_changed');
        break;
    }
  }

  setTheme(value) {
    if (value) {
      this.theme = 'darkTheme';
    } else {
      this.theme = 'lightTheme';
    }

    this.setThemeInDB(this.theme);
  }

  async getDBInstance() {
    return new Promise(async (resolve, reject) => {
      let dbInstance = await idb.open('zhawoDB', 1, function(upgradeDB) {
        switch (upgradeDB.oldVersion) {
          case 0:
            upgradeDB.createObjectStore('info', { keyPath: 'id' });
          case 1:
          // When we make a version 2 we can add those features here
        }
      });
      if (dbInstance) resolve(dbInstance);
    });
  }

  async getUsernameFromDB() {
    let dbInstance = await this.getDBInstance();

    let tx = dbInstance.transaction('info', 'readonly');
    let store = tx.objectStore('info');

    // add, clear, count, delete, get, getAll, getAllKeys, getKey, put
    let user = await store.get('username');

    this.currentUser = user.username;
    this.currentUserType = user.type;

    this.emit('current_user_changed');
    dbInstance.close();
  }

  async getThemeFromDB() {
    let dbInstance = await this.getDBInstance();

    let tx = dbInstance.transaction('info', 'readonly');
    let store = tx.objectStore('info');

    // add, clear, count, delete, get, getAll, getAllKeys, getKey, put
    let theme = await store.get('theme');

    if (theme) this.theme = theme.theme;
    this.emit('theme_changed');

    dbInstance.close();
  }

  // TODO: change so that what you are saving is the key

  async setThemeInDB(theme) {
    let dbInstance = await this.getDBInstance();

    let tx = dbInstance.transaction('info', 'readwrite');
    let store = tx.objectStore('info');

    await store.put({ id: 'theme', theme: theme });

    await tx.complete;
    dbInstance.close();
  }

  async setCurrentUser(name, type) {
    let dbInstance = await this.getDBInstance();

    let tx = dbInstance.transaction('info', 'readwrite');
    let store = tx.objectStore('info');

    await store.put({ id: 'username', username: name, type: type });

    await tx.complete;
    dbInstance.close();
  }

  async removeCurrentUser() {
    let dbInstance = await this.getDBInstance();

    let tx = dbInstance.transaction('info', 'readwrite');
    let store = tx.objectStore('info');

    let allSavedItems = await store.getAllKeys();

    await store.delete('username');

    await tx.complete;
    dbInstance.close();
  }
}

const globalStore = new GlobalStore();

dispatcher.register(globalStore.handleActions.bind(globalStore));

export default globalStore;
