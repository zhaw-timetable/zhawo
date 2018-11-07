import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';

import idb from 'idb';

class GlobalStore extends EventEmitter {
  constructor() {
    super();
    this.currentUser = '';
    this.currentUserType = '';
    this.possibleNames = [];
    this.possibleLoginNames = [];
    this.drawerOpen = false;
    this.getUsernameFromDB();
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
    }
  }

  async getUsernameFromDB() {
    let dbInsance = await idb.open('zhawoDB', 1, upgradeDB =>
      upgradeDB.createObjectStore('users', { autoIncrement: true })
    );
    console.log('getUserNameFromDB');

    let tx = dbInsance.transaction('users', 'readonly');
    let store = tx.objectStore('users');

    // add, clear, count, delete, get, getAll, getAllKeys, getKey, put
    let allSavedItems = await store.getAll();
    console.log(allSavedItems);

    console.log(allSavedItems[0].name, allSavedItems[0].type);
    this.currentUser = allSavedItems[0].name;
    this.currentUserType = allSavedItems[0].type;
    this.emit('current_user_changed');

    dbInsance.close();
  }

  async setCurrentUser(name, type) {
    let dbInsance = await idb.open('zhawoDB', 1, upgradeDB =>
      upgradeDB.createObjectStore('users', { autoIncrement: true })
    );

    let tx = dbInsance.transaction('users', 'readwrite');
    let store = tx.objectStore('users');

    await store.put({ name: name, type: type });

    await tx.complete;
    console.log(name, type, ' saved to indexedDB');
    dbInsance.close();
  }
}

const globalStore = new GlobalStore();

dispatcher.register(globalStore.handleActions.bind(globalStore));

export default globalStore;
