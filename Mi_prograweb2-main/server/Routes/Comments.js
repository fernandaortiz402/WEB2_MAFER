const express = require('express');
const router = express.Router();
const Comments = require('../Models/Model_comments');
const Movies = require('../Models/Model_movies');
const User = require('../Models/Model_user');

// POST /api/comments - Crear un nuevo comentario
router.post('/', async (req, res) => {
  try {
    const { Comentario, movie, user } = req.body;

    // Validar que el comentario no esté vacío
    if (!Comentario || Comentario.trim().length === 0) {
      return res.status(400).json({ error: 'El comentario no puede estar vacío' });
    }

    if (Comentario.length > 500) {
      return res.status(400).json({ error: 'El comentario no puede exceder 500 caracteres' });
    }

    // Verificar si el Pelicula existe
    const movieExists = await Movies.findById(movie);
    if (!movieExists) {
      return res.status(404).json({ error: 'Pelicula no encontrado' });
    }

    // Verificar si el usuario existe
    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Crear nuevo comentario
    const newComment = new Comments({
      Comentario: Comentario.trim(),
      movie,
      user
    });

    const savedComment = await newComment.save();
    
    // Populate para devolver datos completos
    await savedComment.populate('user', 'Nombre_usuario fotoPerfil');
    await savedComment.populate('movie', 'Titulo');

    res.status(201).json({
      message: 'Comentario creado exitosamente',
      comment: savedComment
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get('/movie/:movieId', async (req, res) => {
  try {
    const comments = await Comments.find({ movie: req.params.movieId })
      .populate('user', 'Nombre_usuario fotoPerfil')
      .sort({ _id: -1 })
      .limit(50)
      .lean();

    res.json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al obtener comentarios' });
  }
});
module.exports = router;