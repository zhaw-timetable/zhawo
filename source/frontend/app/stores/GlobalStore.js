import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';

import idb from 'idb';
var dbPromise = idb.open('zhawoDB', 1, function(upgradeDB) {
  if (!upgradeDB.objectStoreNames.contains('users')) {
    upgradeDB.createObjectStore('users', {
      keyPath: 'id'
    });
  }
});

class GlobalStore extends EventEmitter {
  constructor() {
    super();
    this.currentUser = this.getUsernameFromDB() || '';
    this.currentUserType = '';
    this.possibleNames = [];
    this.possibleLoginNames = [];
  }

  getUsernameFromDB() {
    dbPromise
      .then(db => {
        return db
          .transaction('users')
          .objectStore('users')
          .getAll();
      })
      .then(allObjs => console.log(allObjs));
    return '';
  }

  setUsername(username, type) {
    this.currentUser = name;
    this.currentUserType = type;
    dbPromise.then(db => {
      const tx = db.transaction('users', 'readwrite');
      tx.objectStore('users').put({
        id: username,
        data: { user: username }
      });
      return tx.complete;
    });
  }

  handleActions(action) {
    switch (action.type) {
      case 'SET_CURRENT_USER':
        this.setUsername(action.payload.name, action.payload.type);
        this.emit('current_user_changed');
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
}

const globalStore = new GlobalStore();

dispatcher.register(globalStore.handleActions.bind(globalStore));

export default globalStore;
