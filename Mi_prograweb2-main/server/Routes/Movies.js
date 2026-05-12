const express = require('express');
const router = express.Router();
const movieController = require('../Controllers/movieController');
const { uploadMultiple } = require('../middleware/uploadMovies');
const auth = require('../middleware/auth');

router.get('/', movieController.getAllMovies);
router.get('/:id', movieController.getMovieById);
router.post('/', auth, uploadMultiple, movieController.createMovie);

module.exports = router;
