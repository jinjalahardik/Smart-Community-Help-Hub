export function notFound(_req, res) {
  res.status(404).json({ message: 'Route not found', status: 404 });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  const status = err.status || err.statusCode || 500;

  // Log full error server-side for debugging
  if (status >= 500) {
    console.error('[server] error:', err.message || err);
  }

  // Never leak stack traces, internal paths, or sensitive details to the client
  const safeMessage = status >= 500
    ? 'Internal server error'
    : (err.message || 'An error occurred');

  res.status(status).json({
    message: safeMessage,
    status,
  });
}
