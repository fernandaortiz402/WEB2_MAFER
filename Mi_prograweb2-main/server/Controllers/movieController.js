const Movies = require('../Models/Model_movies');
const Media = require('../Models/Model_media');

const createMovie = async (req, res) => {
  try {
    const {
      titulo,
      cantidad,
      precio,
      informacion,
      director,
      estudio,
      duracion,
      anio,
      clasificacion,
      categoria,
      genero
    } = req.body;

    const nuevaPelicula = new Movies({
      Titulo: titulo,
      Cantidad: parseInt(cantidad, 10),
      Precio: parseFloat(precio),
      Informacion: informacion,
      Director: director,
      Estudio: estudio || null,
      Duracion: parseInt(duracion, 10),
      Anio_Lanzamiento: parseInt(anio, 10),
      Clasificacion: clasificacion,
      categoria,
      Genero: genero || 'General',
      Distribuidor: req.user._id,
      imagenes: []
    });

    const peliculaGuardada = await nuevaPelicula.save();

    if (req.files && req.files.length > 0) {
      const medias = await Promise.all(
        req.files.map((file) =>
          new Media({
            filename: file.filename,
            movie: peliculaGuardada._id
          }).save()
        )
      );

      peliculaGuardada.imagenes = medias.map((media) => media._id);
      await peliculaGuardada.save();
    }

    return res.status(201).json({
      success: true,
      movie: peliculaGuardada
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getAllMovies = async (req, res) => {
  try {
    const { director, anio, genero } = req.query;
    const filters = { activo: true };

    if (director) filters.Director = new RegExp(director, 'i');
    if (anio) filters.Anio_Lanzamiento = Number(anio);
    if (genero) filters.Genero = new RegExp(genero, 'i');

    const movies = await Movies.find(filters)
      .populate('Estudio', 'Nombre_Estudio')
      .populate('categoria', 'name')
      .populate('imagenes', 'filename')
      .populate('Distribuidor', 'Nombre_usuario Correo');

    return res.json({ success: true, count: movies.length, movies });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Error al obtener peliculas' });
  }
};

const getMovieById = async (req, res) => {
  try {
    const movie = await Movies.findById(req.params.id)
      .populate('Estudio', 'Nombre_Estudio')
      .populate('categoria', 'name')
      .populate('imagenes', 'filename')
      .populate('Distribuidor', 'Nombre_usuario');

    if (!movie) {
      return res.status(404).json({ success: false, error: 'Pelicula no encontrada' });
    }

    return res.json({ success: true, movie });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Error al obtener la pelicula' });
  }
};

module.exports = { createMovie, getAllMovies, getMovieById };
