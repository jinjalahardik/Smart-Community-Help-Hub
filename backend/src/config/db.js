import mongoose from 'mongoose';

const CONNECT_OPTS = {
  autoIndex: true,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  maxPoolSize: 20,
};

export async function connectDB(uri = process.env.MONGODB_URI) {
  if (!uri) {
    console.error('[mongodb] MONGODB_URI is not set. Add it to your .env file.');
    process.exit(1);
  }

  mongoose.connection.on('error', (err) => {
    console.error('[mongodb] connection error:', err.message);
  });

  try {
    const conn = await mongoose.connect(uri, CONNECT_OPTS);
    console.log(
      `MongoDB Atlas Connected: ${conn.connection.host} / DB: ${conn.connection.name}`
    );
    return conn.connection;
  } catch (error) {
    console.error(`MongoDB Atlas Connection Error: ${error.message}`);

    if (
      error.message.includes('whitelist') ||
      error.message.includes('Could not connect') ||
      error.message.includes('getaddrinfo') ||
      error.message.includes('Authentication failed')
    ) {
      console.error('');
      console.error('>> FIX (Atlas):');
      console.error('  1. Go to Atlas > Network Access > Add IP Address > Allow Access From Anywhere (0.0.0.0/0)');
      console.error('  2. Go to Database Access > ensure user has Read/Write to Any Database');
      console.error('  3. Verify the password in MONGODB_URI is correct (URL-encoded if it has special chars)');
    }
    process.exit(1);
  }
}

mongoose.connection.on('disconnected', () => {
  console.log('[mongodb] disconnected');
});

mongoose.connection.on('connected', () => {
  console.log('[mongodb] connected event fired');
});

export function isConnected() {
  return mongoose.connection.readyState === 1;
}
