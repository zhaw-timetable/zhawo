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

  async getUsernameFromDB() {
    let dbInsance = await idb.open('zhawoDB', 1, upgradeDB =>
      upgradeDB.createObjectStore('info', { keyPath: 'id' })
    );

    let tx = dbInsance.transaction('info', 'readonly');
    let store = tx.objectStore('info');

    // add, clear, count, delete, get, getAll, getAllKeys, getKey, put
    let user = await store.get('username');
    console.log(user);

    if (user) console.log(user.username, user.type);
    this.currentUser = user.username;
    this.currentUserType = user.type;

    this.emit('current_user_changed');
    dbInsance.close();
  }

  async getThemeFromDB() {
    let dbInsance = await idb.open('zhawoDB', 1, upgradeDB =>
      upgradeDB.createObjectStore('info', { keyPath: 'id' })
    );

    let tx = dbInsance.transaction('info', 'readonly');
    let store = tx.objectStore('info');

    // add, clear, count, delete, get, getAll, getAllKeys, getKey, put
    let theme = await store.get('theme');
    console.log(theme);

    if (theme) this.theme = theme.theme;
    this.emit('theme_changed');

    dbInsance.close();
  }

  // TODO: change so that what you are saving is the key

  async setThemeInDB(theme) {
    let dbInsance = await idb.open('zhawoDB', 1, upgradeDB =>
      upgradeDB.createObjectStore('info', { keyPath: 'id' })
    );

    let tx = dbInsance.transaction('info', 'readwrite');
    let store = tx.objectStore('info');

    await store.put({ id: 'theme', theme: theme });

    await tx.complete;
    console.log(theme, ' saved to indexedDB');
    dbInsance.close();
  }

  async setCurrentUser(name, type) {
    let dbInsance = await idb.open('zhawoDB', 1, upgradeDB =>
      upgradeDB.createObjectStore('info', { keyPath: 'id' })
    );

    let tx = dbInsance.transaction('info', 'readwrite');
    let store = tx.objectStore('info');

    await store.put({ id: 'username', username: name, type: type });

    await tx.complete;
    console.log(name, type, ' saved to indexedDB');
    dbInsance.close();
  }

  async removeCurrentUser() {
    console.log('Removing user from indexedDB');
    let dbInsance = await idb.open('zhawoDB', 1, upgradeDB =>
      upgradeDB.createObjectStore('info', { autoIncrement: false })
    );

    let tx = dbInsance.transaction('info', 'readwrite');
    let store = tx.objectStore('info');

    let allSavedItems = await store.getAllKeys();

    await store.delete('username');

    await tx.complete;
    console.log('Removed user from indexedDB');
    dbInsance.close();
  }
}

const globalStore = new GlobalStore();

dispatcher.register(globalStore.handleActions.bind(globalStore));

export default globalStore;
