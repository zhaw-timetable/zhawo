import dispatcher from '../dispatcher';

import idb from 'idb';

var dbPromise = idb.open('zhawoDB', 1, function(upgradeDB) {
  if (!upgradeDB.objectStoreNames.contains('users')) {
    upgradeDB.createObjectStore('users', {
      keyPath: 'id'
    });
  }
});

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
        type: 'SET_USERNAME',
        payload: allObjs[0].data.user
      })
    );
}

export function setUsername(username) {
  // TODO: if not sucess
  dbPromise
    .then(db => {
      const tx = db.transaction('users', 'readwrite');
      tx.objectStore('users').put({
        id: 123456,
        data: { user: username }
      });
      // see if success
      console.log(tx.complete);
      return tx.complete;
    })
    .then(
      dispatcher.dispatch({
        type: 'SET_USERNAME',
        payload: username
      })
    );
}
