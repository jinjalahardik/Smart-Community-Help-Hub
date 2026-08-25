// Server-Sent Events (SSE) manager for real-time notifications.
// Replaces Socket.io with zero external dependencies.

const clients = new Map(); // userId -> Set<res>

export function registerSSE(userId, res) {
  if (!clients.has(userId)) clients.set(userId, new Set());
  clients.get(userId).add(res);

  res.on('close', () => {
    const set = clients.get(userId);
    if (set) {
      set.delete(res);
      if (set.size === 0) clients.delete(userId);
    }
  });
}

export function sendToUser(userId, event, data) {
  const set = clients.get(userId);
  if (!set) return;
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of set) {
    try { res.write(payload); } catch { set.delete(res); }
  }
}

export function sendToRole(role, event, data, users) {
  if (!users) return;
  for (const u of users) {
    if (u.role === role) sendToUser(u.id, event, data);
  }
}

export function sseHandler(req, res) {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: 'userId query parameter is required' });

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.write(`event: connected\ndata: ${JSON.stringify({ userId })}\n\n`);

  const keepAlive = setInterval(() => {
    try { res.write(': keepalive\n\n'); } catch { clearInterval(keepAlive); }
  }, 30000);

  res.on('close', () => clearInterval(keepAlive));
  registerSSE(userId, res);
}
