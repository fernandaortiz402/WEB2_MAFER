const User = require('../Models/Model_user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // ✅ Usar bcryptjs

const buildPublicUser = (u) => ({
  id: u._id,
  Nombre_usuario: u.Nombre_usuario,
  Correo: u.Correo,
  Rol: u.Rol,
  Sexo: u.Sexo,
  Telefono: u.Telefono,
  fotoPerfil: u.fotoPerfil || ''
});

// Registrar nuevo usuario (multipart: Multer ya ejecutó antes → req.body y req.file listos)
const register = async (req, res) => {
  try {
    const Nombre_usuario = (req.body.Nombre_usuario || '').trim();
    const Correo = (req.body.Correo || '').trim();
    const Contrasenia = req.body.Contrasenia;
    const Sexo = (req.body.Sexo || '').trim();
    const Rol = (req.body.Rol || '').trim();
    const Telefono = (req.body.Telefono || '').trim();

    if (!Nombre_usuario || !Correo || !Contrasenia || !Sexo || !Rol || !Telefono) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos obligatorios. Si subiste foto, revisa que el formulario sea multipart.',
        details: `Recibido: Nombre=${!!Nombre_usuario}, Correo=${!!Correo}, Contrasenia=${!!Contrasenia}, Sexo=${!!Sexo}, Rol=${!!Rol}, Telefono=${!!Telefono}`
      });
    }

    const fotoPerfil = req.file ? `/uploads/${req.file.filename}` : '';

    const existingUser = await User.findOne({
      $or: [{ Correo }, { Nombre_usuario }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'El correo o nombre de usuario ya está registrado'
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Contrasenia, saltRounds);

    const user = new User({
      Nombre_usuario,
      Correo,
      Contrasenia: hashedPassword,
      Sexo,
      Rol,
      Telefono,
      fotoPerfil
    });

    const savedUser = await user.save();

    const token = jwt.sign(
      {
        userId: savedUser._id,
        email: savedUser.Correo,
        role: savedUser.Rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      user: buildPublicUser(savedUser)
    });
  } catch (error) {
    console.error('❌ [REGISTER] catch:', error.name, error.message);
    console.error('❌ [REGISTER] stack:', error.stack);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'El correo o nombre de usuario ya está registrado'
      });
    }
    res.status(400).json({
      success: false,
      error: 'Error al registrar usuario',
      details: error.message
    });
  }
};

// Login de usuario
const login = async (req, res) => {
  try {
    const Correo = (req.body.Correo || '').trim();
    const Contrasenia = req.body.Contrasenia;

    console.log('Datos recibidos para login:', { Correo, Contrasenia: Contrasenia ? '***' : '(vacía)' });
    
    if (!Correo || !Contrasenia) {
      return res.status(400).json({
        success: false,
        error: 'Correo y contraseña son obligatorios'
      });
    }

    // Buscar usuario por correo
    const user = await User.findOne({ Correo });
    if (!user) {
       console.log('Usuario no encontrado:', Correo);
      return res.status(401).json({
        success: false,
        error: 'Credenciales incorrectas'
      });
    }

    console.log('Usuario encontrado:', user.Nombre_usuario);

    
    // Verificar contraseña (sin encriptación por ahora)
    const isMatch = await bcrypt.compare(Contrasenia, user.Contrasenia);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Contraseña incorrecta'
      });
    }

    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.Correo,
        role: user.Rol 
      }, 
      process.env.JWT_SECRET, // ✅ Usando variable de entorno
      { expiresIn: '24h' }
    );
    
    console.log('Login exitoso para:', user.Nombre_usuario);
    console.log('✅ Token generado para usuario:', user.Nombre_usuario);
    res.json({
      success: true,
      message: 'Login exitoso',
      user: buildPublicUser(user),
      token: token
    });
  } catch (error) {
    console.error('❌ [LOGIN] catch:', error.name, error.message);
    console.error('❌ [LOGIN] stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Error en el servidor',
      details: error.message
    });
  }
};

// Obtener usuario por ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }
    res.json({
      success: true,
      user: user
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: 'Usuario no encontrado'
    });
  }
};

// Actualizar usuario
const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      user: updatedUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Error al actualizar usuario',
      details: error.message
    });
  }
};

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({
      success: true,
      count: users.length,
      users: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener usuarios',
      details: error.message
    });
  }
};

// Eliminar usuario
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente',
      user: deletedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al eliminar usuario',
      details: error.message
    });
  }
};

// Exportar todos los métodos
module.exports = {
  register,
  login,
  getUserById,
  updateUser,
  getAllUsers,
  deleteUser
};