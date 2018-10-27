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
    this.username = this.getUsernameFromDB() || '';
  }

  getUsername() {
    return this.username;
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

  setUsername(username) {
    this.username = username;
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
      case 'SET_NAME':
        this.naem = action.payload;
        this.emit('name_changed');
        break;
      case 'SET_USERNAME':
        this.setUsername(action.payload);
        this.emit('username_changed');
        break;
    }
  }
}

const globalStore = new GlobalStore();

dispatcher.register(globalStore.handleActions.bind(globalStore));

export default globalStore;
