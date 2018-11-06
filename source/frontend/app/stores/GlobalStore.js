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
    this.currentUser = '';
    this.currentUserType = '';
    this.possibleNames = [];
    this.possibleLoginNames = [];
    this.getUsernameFromDB();
  }

  handleActions(action) {
    switch (action.type) {
      case 'SET_CURRENT_USER':
        this.currentUser = action.payload.name;
        this.currentUserType = action.payload.type;
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

  getUsernameFromDB() {
    console.log('getUserNameFromDB');
    dbPromise
      .then(db => {
        return db
          .transaction('users')
          .objectStore('users')
          .getAll();
      })
      // .then(allObjs =>
      //   dispatcher.dispatch({
      //     type: 'SET_CURRENT_USER',
      //     payload: { name: allObjs[0].data.name, type: allObjs[0].data.type }
      //   })
      // );
      .then(allObjs => {
        console.log(allObjs[0].data.name, allObjs[0].data.type);
        this.currentUser = allObjs[0].data.name;
        this.currentUserType = allObjs[0].data.type;
        this.emit('current_user_changed');
        // this.handleActions({
        //   type: 'SET_CURRENT_USER',
        //   payload: {
        //     name: allObjs[0].data.name,
        //     type: allObjs[0].data.type
        //   }
        // });
        // this.currentUser = allObjs[0].data.name;
        // this.currentUserType = allObjs[0].data.type;
      });
  }
}

const globalStore = new GlobalStore();

dispatcher.register(globalStore.handleActions.bind(globalStore));

export default globalStore;
