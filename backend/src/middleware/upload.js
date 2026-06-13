const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Subdirectory helper
const ensureDir = (subdir) => {
  const dir = path.join(uploadsDir, subdir);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
};

// Storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let subdir = 'misc';
    if (req.baseUrl.includes('users') || req.path.includes('avatar')) subdir = 'avatars';
    else if (req.baseUrl.includes('posts')) subdir = 'posts';
    else if (req.baseUrl.includes('products')) subdir = 'products';

    const dir = ensureDir(subdir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// File filter – images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp, svg)'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Helper to get relative URL path from absolute file path
const getImageUrl = (filePath) => {
  if (!filePath) return null;
  const relativePath = filePath.replace(/\\/g, '/').split('uploads/')[1];
  return `/uploads/${relativePath}`;
};

module.exports = { upload, getImageUrl };
