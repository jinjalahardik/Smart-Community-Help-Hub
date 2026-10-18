export function notFound(_req, res) {
  res.status(404).json({ error: 'Route not found', message: 'Route not found', status: 404 });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  const status = err?.status || err?.statusCode || 500;
  const isDev = process.env.NODE_ENV !== 'production';

  // Log full error server-side for debugging
  if (status >= 500) {
    console.error('[server] error:', err);
  } else {
    console.error('[server] handled error:', err?.message);
  }

  // In development, return the real message and stack for easier debugging,
  // except never leak raw JavaScript TypeErrors like "Cannot read properties of undefined".
  // In production, never leak stack traces, internal paths, or sensitive details.
  const rawMsg = err?.message || 'An error occurred';
  const isUndefinedError =
    typeof rawMsg === 'string' &&
    (rawMsg.includes('Cannot read properties of undefined') || rawMsg.includes('undefined (reading'));

  let safeMessage;
  if (isUndefinedError) {
    safeMessage = 'Payment gateway error: Payment gateway temporarily unavailable';
  } else if (status >= 500 && !isDev) {
    safeMessage = 'Internal server error';
  } else {
    safeMessage = rawMsg;
  }

  const body = {
    error: safeMessage,
    message: safeMessage,
    status,
  };
  if (isDev && status >= 500 && err?.stack) {
    body.stack = err.stack;
  }

  res.status(status).json(body);
}
