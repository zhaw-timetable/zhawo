import idb from 'idb';

async function getDBInstance() {
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

export async function getUsername() {
  return new Promise(async (resolve, reject) => {
    let dbInstance = await getDBInstance();
    let tx = dbInstance.transaction('info', 'readonly');
    let store = tx.objectStore('info');
    // add, clear, count, delete, get, getAll, getAllKeys, getKey, put
    let user = await store.get('username');
    dbInstance.close();
    resolve(user);
  });
}

export async function getTheme() {
  return new Promise(async (resolve, reject) => {
    let dbInstance = await getDBInstance();
    let tx = dbInstance.transaction('info', 'readonly');
    let store = tx.objectStore('info');
    // add, clear, count, delete, get, getAll, getAllKeys, getKey, put
    let theme = await store.get('theme');
    dbInstance.close();
    resolve(theme);
  });
}

// TODO: change so that what you are saving is the key

export async function setTheme(theme) {
  return new Promise(async (resolve, reject) => {
    let dbInstance = await getDBInstance();

    let tx = dbInstance.transaction('info', 'readwrite');
    let store = tx.objectStore('info');

    await store.put({ id: 'theme', theme: theme });

    await tx.complete;
    dbInstance.close();
    resolve();
  });
}

export async function setUser(name, type) {
  return new Promise(async (resolve, reject) => {
    let dbInstance = await getDBInstance();

    let tx = dbInstance.transaction('info', 'readwrite');
    let store = tx.objectStore('info');

    await store.put({ id: 'username', username: name, type: type });

    await tx.complete;
    dbInstance.close();
    resolve();
  });
}

export async function removeUser() {
  return new Promise(async (resolve, reject) => {
    let dbInstance = await getDBInstance();

    let tx = dbInstance.transaction('info', 'readwrite');
    let store = tx.objectStore('info');

    await store.getAllKeys();

    await store.delete('username');

    await tx.complete;
    dbInstance.close();
    resolve();
  });
}
