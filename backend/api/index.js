// Vercel serverless entry point.
// Wraps the Express app so every /api/* request routes through this single function.
// DB connection is cached globally to avoid re-connecting on every invocation.
import mongoose from 'mongoose';
import app from '../src/app.js';

// ── Cached DB connection (serverless-safe) ──────────────────────────────────
let cached = globalThis.__schh_mongo;
if (!cached) cached = globalThis.__schh_mongo = { conn: null, promise: null };

async function connectOnce() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is not set');
    cached.promise = mongoose
      .connect(uri, {
        autoIndex: true,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
      })
      .then((m) => m.connection)
      .catch((err) => {
        cached.promise = null; // allow retry on next invocation
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Kick off the first connection immediately; warm invocations reuse the cache.
connectOnce().catch((err) => {
  console.error('[vercel] initial DB connection failed:', err.message);
});

// Intercept every request to ensure the DB is ready before Express handlers run.
const readyHandler = async (req, res) => {
  try {
    await connectOnce();
  } catch (err) {
    return res.status(503).json({ status: 'error', message: 'Database unavailable', detail: err.message });
  }
  return app(req, res);
};

export default readyHandler;
