// storageService.js
// Thin wrapper around window.localStorage used as our demo "database".
// NOTE: For production, this must be replaced by real HTTP calls to a
// secure backend. Auth tokens must never be stored in localStorage in
// production — use secure, HTTP-only cookies instead.

const PREFIX = 'sch_hub_';

function key(name) {
  return `${PREFIX}${name}`;
}

export const storageService = {
  get(name, fallback = null) {
    try {
      const raw = localStorage.getItem(key(name));
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      console.error('storageService.get error', e);
      return fallback;
    }
  },

  set(name, value) {
    try {
      localStorage.setItem(key(name), JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('storageService.set error', e);
      return false;
    }
  },

  remove(name) {
    localStorage.removeItem(key(name));
  },

  has(name) {
    return localStorage.getItem(key(name)) !== null;
  },

  clearAll() {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  },
};

export const STORE_KEYS = {
  USERS: 'users',
  NGOS: 'ngos',
  HOSPITALS: 'hospitals',
  DONATIONS: 'donations',
  REQUESTS: 'requests',
  TASKS: 'tasks',
  INVENTORY: 'inventory',
  NOTIFICATIONS: 'notifications',
  FEEDBACK: 'feedback',
  CHATS: 'chats',
  MESSAGES: 'messages',
  AUDIT_LOGS: 'audit_logs',
  REQUIREMENTS: 'requirements',
  SESSION: 'session',
  THEME: 'theme',
  SEEDED: 'seeded_v1',
};
