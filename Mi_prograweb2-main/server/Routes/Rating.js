const express = require('express');
const router = express.Router();
const Rating = require('../Models/Model_rating');
const Movies = require('../Models/Model_movies');

// POST /api/ratings - Crear o actualizar una calificación
router.post('/', async (req, res) => {
  try {
    const { Calificacion, movie, user } = req.body;

    // Validar que la calificación esté entre 1 y 5
    if (Calificacion < 1 || Calificacion > 5) {
      return res.status(400).json({ error: 'La calificación debe estar entre 1 y 5' });
    }

    // Verificar si el Pelicula existe
    const movieExists = await Movies.findById(movie);
    if (!movieExists) {
      return res.status(404).json({ error: 'Pelicula no encontrado' });
    }

    // Buscar si ya existe una calificación del mismo usuario para el mismo Pelicula
    const existingRating = await Rating.findOne({ movie, user });

    if (existingRating) {
      // Actualizar calificación existente
      existingRating.Calificacion = Calificacion;
      const updatedRating = await existingRating.save();
      
      // Populate para devolver datos completos
      await updatedRating.populate('user', 'username');
      await updatedRating.populate('movie', 'Titulo');
      
      return res.json({
        message: 'Calificación actualizada',
        rating: updatedRating
      });
    } else {
      // Crear nueva calificación
      const newRating = new Rating({
        Calificacion,
        movie,
        user
      });

      const savedRating = await newRating.save();
      
      // Populate para devolver datos completos
      await savedRating.populate('user', 'username');
      await savedRating.populate('movie', 'Titulo');

      res.status(201).json({
        message: 'Calificación creada',
        rating: savedRating
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/ratings - Obtener todas las calificaciones con filtros
router.get('/', async (req, res) => {
  try {
    const { movie, user } = req.query;
    let filter = {};

    // Filtros opcionales
    if (movie) filter.movie = movie;
    if (user) filter.user = user;

    const ratings = await Rating.find(filter)
      .populate('user', 'username email') // Datos del usuario
      .populate('movie', 'Titulo');

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener calificaciones' });
  }
});

// GET /api/ratings/movie/:movieId — calificaciones de una película
router.get('/movie/:movieId', async (req, res) => {
  try {
    const ratings = await Rating.find({ movie: req.params.movieId })
      .populate('user', 'username')
      .populate('movie', 'Titulo');

    // Calcular promedio de calificaciones
    const averageRating = ratings.reduce((sum, rating) => sum + rating.Calificacion, 0) / ratings.length;

    res.json({
      ratings,
      average: averageRating || 0,
      total: ratings.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener calificaciones del Pelicula' });
  }
});

module.exports = router;