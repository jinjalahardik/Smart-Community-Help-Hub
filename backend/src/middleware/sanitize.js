// NoSQL query and body sanitizer middleware.
// Prevents MongoDB query operator injection (e.g. $ne, $gt, $regex, etc.)
// while preserving legitimate primitives (strings, numbers, booleans, arrays).

function sanitizeInPlace(obj) {
  if (!obj || typeof obj !== 'object') return;
  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('\0')) {
      delete obj[key];
    } else if (obj[key] !== null && typeof obj[key] === 'object') {
      sanitizeInPlace(obj[key]);
    }
  }
}

export function sanitizeInput(req, _res, next) {
  if (req.query) sanitizeInPlace(req.query);
  if (req.params) sanitizeInPlace(req.params);
  if (req.body && typeof req.body === 'object') sanitizeInPlace(req.body);
  next();
}
