const multer = require('multer');
const path = require('path');

// Siempre relativo a esta carpeta (server/), no al cwd del proceso
const uploadsAbs = path.join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsAbs);
  },
  filename: (req, file, cb) => {
    cb(null, `perfil-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`);
  }
});

const uploadRegister = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Solo se permiten imagenes para la foto de perfil'));
  }
});

module.exports = uploadRegister;
