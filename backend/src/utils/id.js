// Shared ID generator. Uses the shared seedData module (mirrored from the
// frontend's services/seedData.js) so runtime records match seeded demo IDs.
import { nextId } from '../shared/services/seedData.js';

export { nextId };

// Creates a doc with a freshly generated id, retrying on duplicate-key so
// runtime creation never collides with ids already in the database (seeding
// happens in a separate process where the shared counter restarts at 1000).
export async function createWithRetry(Model, prefix, data) {
  // The runtime counter restarts at 1000 but seeding (a separate process)
  // already consumed part of that range, so the first few allocations can
  // collide with existing ids. Retrying is cheap and the range is small.
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const withId = { id: nextId(prefix), ...data };
    try {
      return await Model.create(withId);
    } catch (err) {
      if (err && err.code === 11000) continue;
      throw err;
    }
  }
  const err = new Error(`Could not allocate a unique ${prefix} id`);
  err.status = 500;
  throw err;
}
