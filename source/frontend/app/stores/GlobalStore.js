import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';

import * as api from '../adapters/ZhawoAdapter';
import idbAdapter from '../adapters/IdbAdapter';

class GlobalStore extends EventEmitter {
  constructor() {
    super();
    this.theme = 'lightTheme';
    this.currentUser = '';
    this.currentUserType = '';
    this.possibleNames = [];
    this.possibleLoginNames = [];
    this.drawerOpen = false;
    this.isDayView = true;
    this.viewState = 0;
    this.initializeStore();
  }

  async handleActions(action) {
    switch (action.type) {
      case 'SET_CURRENT_USER':
        this.setCurrentUser(action.payload.name, action.payload.type);
        break;
      case 'TOGGLE_DRAWER':
        this.drawerOpen = !this.drawerOpen;
        this.emit('drawerOpen_changed');
        break;

      case 'GET_POSSIBLE_NAMES':
        const possibleNames = await api.getPossibleNames().catch(err => {
          console.error(err);
        });
        if (possibleNames) {
          this.possibleNames = [
            ...possibleNames.students,
            ...possibleNames.lecturers,
            ...possibleNames.classes,
            ...possibleNames.courses,
            ...possibleNames.rooms
          ];
          this.possibleLoginNames = [
            ...possibleNames.students,
            ...possibleNames.lecturers
          ];
          this.emit('possible_names_changed');
        }
        break;

      case 'LOGOUT':
        this.removeCurrentUser();
        this.removeViewStateFromDB();
        break;

      case 'CHANGE_THEME':
        this.setTheme(action.payload);
        break;

      case 'SET_DAYVIEW':
        this.isDayView = action.payload;
        this.emit('isDayView_changed');
        break;

      case 'SET_VIEWSTATE':
        this.viewState = action.payload;
        this.setViewStateInDB(this.viewState);
        break;
    }
  }

  async initializeStore() {
    await this.getUserFromDB();
    await this.getThemeFromDB();
    await this.getViewStateFromDB();
    this.emit('current_user_login');
  }

  setTheme(value) {
    if (value) {
      this.theme = 'darkTheme';
    } else {
      this.theme = 'lightTheme';
    }
    this.setThemeInDB(this.theme);
    this.emit('theme_changed');
  }

  async getUserFromDB() {
    let user = await idbAdapter.getUser();
    if (user) {
      this.currentUser = user.username;
      this.currentUserType = user.type;
    }
  }

  async getThemeFromDB() {
    let theme = await idbAdapter.getTheme();
    if (theme) this.theme = theme.theme;
  }

  async setThemeInDB(theme) {
    await idbAdapter.setTheme(theme);
  }

  async setCurrentUser(name, type) {
    this.currentUser = name;
    this.currentUserType = type;
    this.emit('current_user_login');
    await idbAdapter.setUser(name, type);
  }

  async removeCurrentUser() {
    this.drawerOpen = false;
    this.currentUser = '';
    this.currentUserType = '';
    await idbAdapter.removeUser();
    this.emit('current_user_logout');
  }

  async setViewStateInDB(value) {
    await idbAdapter.setViewState(value);
  }

  async getViewStateFromDB() {
    this.viewState = await idbAdapter.getViewState();
  }

  async removeViewStateFromDB() {
    this.viewState = 0;
    await idbAdapter.removeViewState();
  }
}

const globalStore = new GlobalStore();

dispatcher.register(globalStore.handleActions.bind(globalStore));

export default globalStore;
