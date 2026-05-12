// Importar dependencias
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

console.log('🔧 Variables de entorno cargadas:');
console.log('   - JWT_SECRET:', process.env.JWT_SECRET ? '✅ Cargada' : '❌ No encontrada');
console.log('   - MONGODB_URI:', process.env.MONGODB_URI ? '✅ Cargada' : '❌ No encontrada');
console.log('   - PORT:', process.env.PORT || 3000);

// Crear una instancia de la aplicación express
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001'
];
app.use(
  cors({
    origin(origin, cb) {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(null, false);
    },
    credentials: true
  })
);
app.use(express.json());
// Importar rutas
const userRoutes = require('./Routes/User');
// Usar rutas
app.use('/api/users', userRoutes);
app.use('/api/platforms', require('./Routes/Plataform'));
app.use('/api/categories', require('./Routes/Category'));
app.use('/api/studios', require('./Routes/Company'));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Carpeta uploads creada:', uploadsDir);
} else {
  console.log('📁 Carpeta uploads OK (ya existía):', uploadsDir);
}
// Servir archivos estáticos (IMPORTANTE para las imágenes de perfil)
app.use('/uploads', express.static(uploadsDir));
const movieRoutes = require('./Routes/Movies');
app.use('/api/movies', movieRoutes);
app.use('/api/cart', require('./Routes/Cart'));
app.use('/api/orders', require('./Routes/Orders'));
app.use('/api/comments', require('./Routes/Comments'));

// Conectar a MongoDB y luego iniciar el servidor
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movie_paradise_db')
  .then(() => {
    console.log('✅ Conectado a MongoDB - movie_paradise_db');
    
    // Ahora que la DB está conectada, iniciamos el servidor
    app.listen(port, () => {
      console.log(`🚀 Servidor Express escuchando en http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('❌ Error de conexión a MongoDB:', err);
    process.exit(1); // Salir si no puede conectar a la DB
  });