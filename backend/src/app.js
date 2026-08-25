import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.js';
import donationRoutes from './routes/donations.js';
import requestRoutes from './routes/requests.js';
import taskRoutes from './routes/tasks.js';
import ngoRoutes from './routes/ngos.js';
import hospitalRoutes from './routes/hospitals.js';
import inventoryRoutes from './routes/inventory.js';
import notificationRoutes from './routes/notifications.js';
import chatRoutes from './routes/chat.js';
import feedbackRoutes from './routes/feedback.js';
import adminRoutes from './routes/admin.js';
import healthRoutes from './routes/health.js';
import chatbotRoutes from './routes/chatbot.js';
import { sseHandler } from './services/sse.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();

app.disable('x-powered-by');
app.use(helmet());

const DEFAULT_LOCAL_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
];

const allowedOrigins = (process.env.CLIENT_URL || DEFAULT_LOCAL_ORIGINS.join(','))
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

// In development, additionally allow any http(s) origin on localhost/127.0.0.1
// so the frontend keeps working when Vite picks another port (e.g. 5174) or is
// opened via 127.0.0.1. Production stays limited to the explicit CLIENT_URL list.
const allowAnyLocalDevOrigin = process.env.NODE_ENV !== 'production';
function isLocalDevOrigin(origin) {
  try {
    const url = new URL(origin);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
    return url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

app.use(cors({
  origin(origin, cb) {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    if (allowAnyLocalDevOrigin && isLocalDevOrigin(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/ngos', ngoRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.get('/api/events', sseHandler);

app.get('/', (_req, res) => {
  res.json({ service: 'smart-community-help-hub-api', health: '/api/health' });
});

app.use(notFound);
app.use(errorHandler);

export default app;
