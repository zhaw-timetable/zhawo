import idb from 'idb';

/**
 * Adapter used to interact with idb
 */
class IdbAdapter {
  constructor() {
    this.currentTransaction = null;
  }

  /**
   * Async function that opens idb on client.
   * If idb instance does not exist it creates one.
   *
   * resolves promise once done
   */
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

  /**
   * Function that return dbInstance used to make transactions
   * @param {*} dbInstance
   * @param {string} accessMode
   */
  getDBTransaction(dbInstance, accessMode) {
    return dbInstance.transaction('info', accessMode);
  }

  /**
   * Async function that return the saved user from idb
   */
  async getUser() {
    return new Promise(async resolve => {
      let dbInstance = await this.getDBInstance();
      let transaction = this.getDBTransaction(dbInstance, 'readonly');
      let store = transaction.objectStore('info');
      let user = await store.get('username');
      dbInstance.close();
      resolve(user);
    });
  }

  /**
   * Async function that return saved theme
   */
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

  /**
   * Async function that saves theme to idb
   * @param {string} theme
   */
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

  /**
   * Async function saves user to idb
   * @param {string} name
   * @param {string} type
   */
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

  /**
   * Async function that removes saved user from db
   */
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

  /**
   * Async function that saves current ViewState to idb
   * @param {number} value
   */
  async setViewState(value) {
    return new Promise(async resolve => {
      let dbInstance = await this.getDBInstance();
      let transaction = this.getDBTransaction(dbInstance, 'readwrite');
      let store = transaction.objectStore('info');
      await store.put({ id: 'viewState', value });
      await transaction.complete;
      dbInstance.close();
      resolve();
    });
  }

  /**
   * Async function that gets saved ViewState from idb
   */
  async getViewState() {
    return new Promise(async resolve => {
      let dbInstance = await this.getDBInstance();
      let transaction = this.getDBTransaction(dbInstance, 'readonly');
      let store = transaction.objectStore('info');
      let viewStateObject = await store.get('viewState');
      let viewState = viewStateObject ? viewStateObject.value : 0;
      dbInstance.close();
      resolve(viewState);
    });
  }

  /**
   * Async function that removes saved ViewState from idb
   */
  async removeViewState() {
    return new Promise(async resolve => {
      let dbInstance = await this.getDBInstance();
      let transaction = this.getDBTransaction(dbInstance, 'readwrite');
      let store = transaction.objectStore('info');
      await store.delete('viewState');
      dbInstance.close();
      resolve();
    });
  }
}

const idbAdapter = new IdbAdapter();
export default idbAdapter;
