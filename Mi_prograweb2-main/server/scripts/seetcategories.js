const mongoose = require('mongoose');
const Category = require('../Models/Model_category');

const categories = [
  { name: 'Acción', description: 'Peliculas de acción y aventura' },
  { name: 'Aventura', description: 'Peliculas de exploración y narrativa' },
  { name: 'Deportes', description: 'Peliculas deportivos y de competición' },
  { name: 'Estrategia', description: 'Peliculas de táctica y planificación' },
  { name: 'RPG', description: 'Peliculas de rol y desarrollo de personajes' },
  { name: 'Shooter', description: 'Peliculas de disparos en primera o tercera persona' },
  { name: 'Simulación', description: 'Peliculas que simulan experiencias reales' },
  { name: 'Indie', description: 'Peliculas desarrollados por estudios independientes' },
  { name: 'Carreras', description: 'Peliculas de carreras y conducción' },
  { name: 'Lucha', description: 'Peliculas de combate y artes marciales' }
];

const seedCategories = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/movie_paradise_db');
    console.log('✅ Conectado a MongoDB');

    // Eliminar categorías existentes
    await Category.deleteMany({});
    console.log('✅ Categorías anteriores eliminadas');

    // Insertar nuevas categorías
    await Category.insertMany(categories);
    console.log('✅ Categorías insertadas correctamente');

    // Mostrar las categorías insertadas
    const categoriasInsertadas = await Category.find();
    console.log('📋 Categorías en la base de datos:');
    categoriasInsertadas.forEach(c => {
      console.log(`   - ${c.name}: ${c.description}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedCategories();