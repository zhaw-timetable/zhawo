import dispatcher from '../dispatcher';
import * as api from '../adapters/ZhawoAdapter';

import idb from 'idb';
var dbPromise = idb.open('zhawoDB', 1, function(upgradeDB) {
  if (!upgradeDB.objectStoreNames.contains('users')) {
    upgradeDB.createObjectStore('users', {
      keyPath: 'id'
    });
  }
});

export const setCurrentUser = (name, type) => {
  // TODO: if not sucess
  console.log('SET_CURRENT_USER');

  console.log(name + ' ' + type);

  dbPromise
    .then(db => {
      const tx = db.transaction('users', 'readwrite');
      tx.objectStore('users').put({
        id: 123456,
        data: { name: name, type: type }
      });
      // see if success
      console.log(tx.complete);
      return tx.complete;
    })
    .then(
      dispatcher.dispatch({
        type: 'SET_CURRENT_USER',
        payload: { name, type }
      })
    );
};

export const getPossibleNames = async () => {
  dispatcher.dispatch({ type: 'GET_POSSIBLE_NAMES_START' });
  console.log('GET_POSSIBLE_NAMES_START');
  const possibleNames = await api.getPossibleNames().catch(err => {
    console.error(err);
  });
  dispatcher.dispatch({
    type: 'GET_POSSIBLE_NAMES_OK',
    payload: possibleNames
  });
  console.log('GET_POSSIBLE_NAMES_OK');
};

export function setUsernameFromDB() {
  dbPromise
    .then(db => {
      return db
        .transaction('users')
        .objectStore('users')
        .getAll();
    })
    .then(allObjs =>
      dispatcher.dispatch({
        type: 'SET_CURRENT_USER',
        payload: { name: allObjs[0].data.name, type: allObjs[0].data.type }
      })
    );
}
