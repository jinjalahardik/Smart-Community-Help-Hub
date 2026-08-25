// File upload middleware using multer.
// Accepts images up to 5MB. Files are stored in memory (for base64 embedding)
// rather than disk, to keep the deployment simple.
// Security: validates MIME type AND file extension to prevent bypass.

import multer from 'multer';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_MIMES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
]);

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  // Validate MIME type
  if (!ALLOWED_MIMES.has(file.mimetype)) {
    return cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'), false);
  }

  // Validate file extension as additional defense against MIME spoofing
  const ext = (file.originalname || '').toLowerCase().match(/\.[^.]+$/)?.[0];
  if (!ext || !ALLOWED_EXTENSIONS.has(ext)) {
    return cb(new Error('Invalid file extension. Allowed: .jpg, .jpeg, .png, .gif, .webp'), false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

export function uploadImages(fieldName = 'images', maxCount = 5) {
  return (req, res, next) => {
    upload.array(fieldName, maxCount)(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
          }
          if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ message: `Too many files. Maximum is ${maxCount}.` });
          }
          return res.status(400).json({ message: err.message });
        }
        return res.status(400).json({ message: err.message });
      }

      if (req.files && req.files.length > 0) {
        req.uploadedImages = req.files.map((f) => ({
          filename: f.originalname,
          mimetype: f.mimetype,
          size: f.size,
          base64: f.buffer.toString('base64'),
        }));
      }
      next();
    });
  };
}

export default upload;
