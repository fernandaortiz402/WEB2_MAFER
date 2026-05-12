const mongoose = require('mongoose');
const Company = require('../Models/Model_company'); // ✅ Company con mayúscula

// ✅ CORREGIDO: Usar nombre diferente para el array
const companiesData = [
  { Nombre_Compania: 'Nintendo' },      // ✅ Nombre_compania (sin ñ)
  { Nombre_Compania: 'Microsoft' },
  { Nombre_Compania: 'Sega' },
  { Nombre_Compania: 'Ubisoft' },
  { Nombre_Compania: 'Naughty Dog' },   // ✅ Corregido: "Dog" no "dog"
  { Nombre_Compania: 'Rockstar Movies' }, // ✅ Corregido: "Rockstar" no "RockStar"
  { Nombre_Compania: 'Electronic Arts' } // ✅ Agregué esta que faltaba
];

const seedCompanies = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/movie_paradise_db');
    console.log('✅ Conectado a MongoDB');

    // Eliminar compañías existentes
    await Company.deleteMany({});
    console.log('✅ Compañías anteriores eliminadas');

    // Insertar nuevas compañías
    await Company.insertMany(companiesData); // ✅ companiesData
    console.log('✅ Compañías insertadas correctamente');

    // Mostrar las compañías insertadas
    const companiasInsertadas = await Company.find(); // ✅ Company
    console.log('📋 Compañías en la base de datos:');
    companiasInsertadas.forEach(c => {
      console.log(`   - ${c.Nombre_compania} (ID: ${c._id})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedCompanies();