import { load, save } from './storage.js';

const KEY = 'bk-intent';

export function setIntent(intent) {
  save(KEY, { ...intent, at: Date.now() });
}

export function consumeIntent() {
  const i = load(KEY, null);
  save(KEY, null);
  return i;
}

export function peekIntent() {
  return load(KEY, null);
}
