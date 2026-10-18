// File upload middleware using multer.
// Accepts images up to 5MB. Files are stored in memory (for base64 embedding).
// Security: validates MIME type, file extension, AND buffer magic bytes to prevent bypass.

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

// Validates buffer magic bytes (file signature)
function isValidImageBuffer(buffer) {
  if (!buffer || buffer.length < 12) return false;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) return true;

  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) return true;

  // GIF: 47 49 46 38 (GIF87a / GIF89a)
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) return true;

  // WebP: RIFF....WEBP
  if (
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
  ) return true;

  return false;
}

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  // Validate MIME type
  if (!ALLOWED_MIMES.has(file.mimetype)) {
    return cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'), false);
  }

  // Validate file extension as defense against MIME spoofing
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
        // Deep verification: inspect buffer magic bytes for each uploaded file
        for (const f of req.files) {
          if (!isValidImageBuffer(f.buffer)) {
            return res.status(400).json({
              message: `File "${f.originalname}" is not a valid image format or has invalid file signatures. Executables and SVGs are prohibited.`,
            });
          }
        }

        req.uploadedImages = req.files.map((f) => ({
          filename: f.originalname.replace(/[^a-zA-Z0-9._-]/g, '_'),
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
