import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';
import { seedDatabase } from './seed.js';

const PORT = Number(process.env.PORT) || 5000;

async function start() {
  try {
    await connectDB();
    // Mirrors the mock's ensureSeeded(): only seeds when the DB is empty.
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`[server] Smart Community Help Hub API listening on http://localhost:${PORT}`);
      console.log(`[server] health check: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error('[server] failed to start:', err.message);
    process.exit(1);
  }
}

start();
