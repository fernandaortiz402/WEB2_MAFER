const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const uploadRegister = require('../middleware/uploadRegister');

// Multer primero: rellena req.body (multipart) y req.file; errores de archivo → JSON claro
const registerUpload = (req, res, next) => {
  uploadRegister.single('fotoPerfil')(req, res, (err) => {
    if (err) {
      console.error('❌ [REGISTER] Multer / archivo:', err.message, err.code || '');
      return res.status(400).json({
        success: false,
        error: err.message || 'Error al procesar la foto de perfil'
      });
    }
    next();
  });
};

router.post('/register', registerUpload, userController.register);
router.post('/login', userController.login);
router.get('/', userController.getAllUsers);        // Obtener todos los usuarios
router.get('/:id', userController.getUserById);     // Obtener usuario por ID
router.put('/:id', userController.updateUser);      // Actualizar usuario
router.delete('/:id', userController.deleteUser);   // Eliminar usuario

module.exports = router;