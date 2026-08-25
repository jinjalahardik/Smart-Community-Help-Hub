import mongoose from 'mongoose';

const CONNECT_OPTS = {
  serverSelectionTimeoutMS: 5000,
  maxPoolSize: 20,
};

export async function connectDB(uri = process.env.MONGODB_URI) {
  mongoose.connection.on('error', (err) => {
    console.error('[mongodb] connection error:', err.message);
  });
  await mongoose.connect(uri, CONNECT_OPTS);
  console.log(`[mongodb] connected to ${mongoose.connection.host}/${mongoose.connection.name}`);
  return mongoose.connection;
}

export function isConnected() {
  return mongoose.connection.readyState === 1;
}
