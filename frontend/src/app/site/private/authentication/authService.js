import { load, save, remove } from '../../../../library/helpers/storage.js';

const KEY = 'bk-auth-user';

export const authService = {
  getSession() {
    return load(KEY, null);
  },
  setSession(user) {
    save(KEY, user);
  },
  clearSession() {
    remove(KEY);
  },
};
