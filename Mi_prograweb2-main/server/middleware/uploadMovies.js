const multer = require('multer');
const path = require('path');

const uploadsAbs = path.join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadsAbs);
  },
  filename(req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

const uploadMultiple = upload.array('imagenes', 10);

module.exports = {
  uploadMultiple
};
