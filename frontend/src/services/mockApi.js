// mockApi.js
// Simulated backend adapter. All feature services call into this layer,
// which in turn reads/writes LocalStorage via storageService.
// When a real backend is ready, replace the internals of these functions
// with axios calls to VITE_API_BASE_URL, keeping the same function signatures.

import { storageService, STORE_KEYS } from './storageService';
import {
  buildSeedUsers, buildSeedNgos, buildSeedHospitals, buildSeedDonations,
  buildSeedRequests, buildSeedTasks, buildSeedInventory, buildSeedNotifications,
  buildSeedFeedback, buildSeedChats, buildSeedAuditLogs, nextId,
} from './seedData';

const DELAY_MS = 450;

export function delay(ms = DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function ensureSeeded() {
  if (storageService.has(STORE_KEYS.SEEDED)) return;
  storageService.set(STORE_KEYS.USERS, buildSeedUsers());
  storageService.set(STORE_KEYS.NGOS, buildSeedNgos());
  storageService.set(STORE_KEYS.HOSPITALS, buildSeedHospitals());
  storageService.set(STORE_KEYS.DONATIONS, buildSeedDonations());
  storageService.set(STORE_KEYS.REQUESTS, buildSeedRequests());
  storageService.set(STORE_KEYS.TASKS, buildSeedTasks());
  storageService.set(STORE_KEYS.INVENTORY, buildSeedInventory());
  storageService.set(STORE_KEYS.NOTIFICATIONS, buildSeedNotifications());
  storageService.set(STORE_KEYS.FEEDBACK, buildSeedFeedback());
  const { chats, messages } = buildSeedChats();
  storageService.set(STORE_KEYS.CHATS, chats);
  storageService.set(STORE_KEYS.MESSAGES, messages);
  storageService.set(STORE_KEYS.AUDIT_LOGS, buildSeedAuditLogs());
  storageService.set(STORE_KEYS.SEEDED, true);
}

// Generic error simulation - real APIs occasionally fail; we simulate a
// small chance-free but explicit failure path used by explicit calls only
// (not random), so the demo stays deterministic and testable.
export class MockApiError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

function readCollection(key) {
  return storageService.get(key, []);
}
function writeCollection(key, data) {
  storageService.set(key, data);
  return data;
}

export const db = {
  list(key) {
    return readCollection(key);
  },
  find(key, predicate) {
    return readCollection(key).find(predicate) || null;
  },
  filter(key, predicate) {
    return readCollection(key).filter(predicate);
  },
  insert(key, item) {
    const items = readCollection(key);
    const withId = { id: item.id || nextId(key.slice(0, 3).toUpperCase()), createdAt: item.createdAt || new Date().toISOString(), ...item };
    items.unshift(withId);
    writeCollection(key, items);
    return withId;
  },
  update(key, id, patch) {
    const items = readCollection(key);
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) throw new MockApiError('Record not found', 404);
    items[idx] = { ...items[idx], ...patch, updatedAt: new Date().toISOString() };
    writeCollection(key, items);
    return items[idx];
  },
  remove(key, id) {
    const items = readCollection(key);
    const next = items.filter((i) => i.id !== id);
    writeCollection(key, next);
    return true;
  },
};

export { STORE_KEYS };
