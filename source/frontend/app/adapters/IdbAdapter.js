import idb from 'idb';

class IdbAdapter {
  constructor() {
    this.currentTransaction = null;
  }
  async getDBInstance() {
    return new Promise(async resolve => {
      let dbInstance = await idb.open('zhawoDB', 1, function(upgradeDB) {
        switch (upgradeDB.oldVersion) {
          case 0:
            upgradeDB.createObjectStore('info', { keyPath: 'id' });
          case 1:
          // When we make a version 2 we can add those features here
        }
      });
      resolve(dbInstance);
    });
  }

  getDBTransaction(dbInstance, accessMode) {
    return dbInstance.transaction('info', accessMode);
  }

  async getUsername() {
    return new Promise(async resolve => {
      let dbInstance = await this.getDBInstance();
      let transaction = this.getDBTransaction(dbInstance, 'readonly');
      let store = transaction.objectStore('info');
      let user = await store.get('username');
      dbInstance.close();
      resolve(user);
    });
  }

  async getTheme() {
    return new Promise(async resolve => {
      let dbInstance = await this.getDBInstance();
      let transaction = this.getDBTransaction(dbInstance, 'readonly');
      let store = transaction.objectStore('info');
      let theme = await store.get('theme');
      dbInstance.close();
      resolve(theme);
    });
  }

  async setTheme(theme) {
    return new Promise(async resolve => {
      let dbInstance = await this.getDBInstance();
      let transaction = this.getDBTransaction(dbInstance, 'readwrite');
      let store = transaction.objectStore('info');
      await store.put({ id: 'theme', theme: theme });
      await transaction.complete;
      dbInstance.close();
      resolve();
    });
  }

  async setUser(name, type) {
    return new Promise(async resolve => {
      let dbInstance = await this.getDBInstance();
      let transaction = this.getDBTransaction(dbInstance, 'readwrite');
      let store = transaction.objectStore('info');
      await store.put({ id: 'username', username: name, type: type });
      await transaction.complete;
      dbInstance.close();
      resolve();
    });
  }

  async removeUser() {
    return new Promise(async resolve => {
      let dbInstance = await this.getDBInstance();
      let transaction = this.getDBTransaction(dbInstance, 'readwrite');
      let store = transaction.objectStore('info');
      await store.delete('username');
      dbInstance.close();
      resolve();
    });
  }
}

const idbAdapter = new IdbAdapter();
export default idbAdapter;
