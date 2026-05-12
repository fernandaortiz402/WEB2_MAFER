const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Movie = require('../Models/Model_movies');
const Category = require('../Models/Model_category');
const User = require('../Models/Model_user');

const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/movie_paradise_db';

async function ensureCategory() {
  let cat = await Category.findOne({ name: 'Peliculas' });
  if (!cat) {
    cat = await Category.create({
      name: 'Peliculas',
      description: 'Categoria inicial Movie Paradise'
    });
  }
  return cat._id;
}

async function ensureDistribuidor() {
  let user = await User.findOne({ Nombre_usuario: 'movieparadise_seed' });
  if (!user) {
    const hash = await bcrypt.hash('Seed123!', 10);
    user = await User.create({
      Nombre_usuario: 'movieparadise_seed',
      Correo: 'seed@movieparadise.local',
      Contrasenia: hash,
      Sexo: 'Otro',
      Rol: 'vendedor',
      Telefono: '0000000000'
    });
  }
  return user._id;
}

async function seed() {
  await mongoose.connect(URI);
  const categoriaId = await ensureCategory();
  const distribuidorId = await ensureDistribuidor();

  await Movie.deleteMany({});

  const movies = [
    { Titulo: 'Inception', Director: 'Christopher Nolan', Duracion: 148, Anio_Lanzamiento: 2010, Clasificacion: 'PG-13', Genero: 'Sci-Fi', Cantidad: 10, Precio: 299, Informacion: 'Un thriller de ciencia ficcion sobre suenos.' },
    { Titulo: 'Interstellar', Director: 'Christopher Nolan', Duracion: 169, Anio_Lanzamiento: 2014, Clasificacion: 'PG-13', Genero: 'Sci-Fi', Cantidad: 8, Precio: 349, Informacion: 'Exploracion espacial y drama familiar.' },
    { Titulo: 'The Dark Knight', Director: 'Christopher Nolan', Duracion: 152, Anio_Lanzamiento: 2008, Clasificacion: 'PG-13', Genero: 'Accion', Cantidad: 12, Precio: 279, Informacion: 'Batman enfrenta al Joker en Gotham.' },
    { Titulo: 'Parasite', Director: 'Bong Joon-ho', Duracion: 132, Anio_Lanzamiento: 2019, Clasificacion: 'R', Genero: 'Drama', Cantidad: 7, Precio: 259, Informacion: 'Una historia de clases sociales y tension.' },
    { Titulo: 'Blade Runner 2049', Director: 'Denis Villeneuve', Duracion: 164, Anio_Lanzamiento: 2017, Clasificacion: 'R', Genero: 'Sci-Fi', Cantidad: 6, Precio: 319, Informacion: 'Secuela visualmente impactante de ciencia ficcion.' }
  ].map((m) => ({
    ...m,
    categoria: categoriaId,
    Distribuidor: distribuidorId,
    activo: true
  }));

  await Movie.insertMany(movies);
  console.log('Seed OK: 5 peliculas + categoria Peliculas + usuario movieparadise_seed (pass Seed123!)');
  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
