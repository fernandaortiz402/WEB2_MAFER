const mongoose = require('mongoose');
const Platform = require('../Models/Model_plataform');

// ✅ CORREGIDO: Usar Nombre_Plataforma en lugar de Nombre_compania
const platforms = [
  { Nombre_Plataforma: 'Nintendo' },
  { Nombre_Plataforma: 'Xbox' },
  { Nombre_Plataforma: 'PlayStation' },
  { Nombre_Plataforma: 'PC' }
];

const seedPlatforms = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/movie_paradise_db');
    console.log('✅ Conectado a MongoDB');

    // Eliminar plataformas existentes
    await Platform.deleteMany({});
    console.log('✅ Plataformas anteriores eliminadas');

    // Insertar nuevas plataformas
    await Platform.insertMany(platforms);
    console.log('✅ Plataformas insertadas correctamente');

    // Mostrar las plataformas insertadas
    const plataformasInsertadas = await Platform.find();
    console.log('📋 Plataformas en la base de datos:');
    plataformasInsertadas.forEach(p => {
      console.log(`   - ${p.Nombre_Plataforma} (ID: ${p._id})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedPlatforms();