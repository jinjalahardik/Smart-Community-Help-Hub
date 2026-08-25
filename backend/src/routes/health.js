import { Router } from 'express';
import { isConnected } from '../config/db.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    status: isConnected() ? 'ok' : 'error',
    service: 'smart-community-help-hub-api',
    db: isConnected() ? 'connected' : 'disconnected',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default router;
