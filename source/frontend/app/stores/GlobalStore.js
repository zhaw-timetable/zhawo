import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';

import idb from 'idb';

class GlobalStore extends EventEmitter {
  constructor() {
    super();

    this.theme = 'lightTheme';

    this.currentUser = '';
    this.currentUserType = '';
    this.possibleNames = [];
    this.possibleLoginNames = [];
    this.drawerOpen = false;
    this.getUsernameFromDB();
    this.getThemeFromDB();
  }

  handleActions(action) {
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
      case 'GET_POSSIBLE_NAMES_OK':
        this.possibleNames = [
          ...action.payload.students,
          ...action.payload.lecturers,
          ...action.payload.classes,
          ...action.payload.courses,
          ...action.payload.rooms
        ];
        this.possibleLoginNames = [
          ...action.payload.students,
          ...action.payload.lecturers
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

    if (user) console.log(user.username, user.type);
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
    console.log(theme, ' saved to indexedDB');
    dbInstance.close();
  }

  async setCurrentUser(name, type) {
    let dbInstance = await this.getDBInstance();

    let tx = dbInstance.transaction('info', 'readwrite');
    let store = tx.objectStore('info');

    await store.put({ id: 'username', username: name, type: type });

    await tx.complete;
    console.log(name, type, ' saved to indexedDB');
    dbInstance.close();
  }

  handleIdbError(err) {
    // do something
  }

  async removeCurrentUser() {
    console.log('Removing user from indexedDB');
    let dbInstance = await this.getDBInstance();

    let tx = dbInstance.transaction('info', 'readwrite');
    let store = tx.objectStore('info');

    let allSavedItems = await store.getAllKeys();

    await store.delete('username');

    await tx.complete;
    console.log('Removed user from indexedDB');
    dbInstance.close();
  }
}

const globalStore = new GlobalStore();

dispatcher.register(globalStore.handleActions.bind(globalStore));

export default globalStore;
