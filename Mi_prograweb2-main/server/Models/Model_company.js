const mongoose = require('mongoose');
const studioSchema = new mongoose.Schema({
  Nombre_Estudio: {
    type: String,
    required: true,
    unique: true
  },
  movies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movies'
    }
  ]
});

module.exports = mongoose.model('Studios', studioSchema);