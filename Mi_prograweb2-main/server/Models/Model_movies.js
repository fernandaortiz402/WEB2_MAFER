const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    Titulo: {
      type: String,
      required: true,
      trim: true
    },
    Cantidad: {
      type: Number,
      required: true,
      min: 0
    },
    Precio: {
      type: Number,
      required: true,
      min: 0
    },
    Informacion: {
      type: String,
      required: true
    },
    Director: {
      type: String,
      required: true,
      trim: true
    },
    Estudio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Studios',
      required: false
    },
    Duracion: {
      type: Number,
      required: true,
      min: 1
    },
    Anio_Lanzamiento: {
      type: Number,
      required: true
    },
    Clasificacion: {
      type: String,
      required: true,
      trim: true
    },
    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    Genero: {
      type: String,
      default: 'General'
    },
    Distribuidor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    imagenes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media'
      }
    ],
    activo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Movies', movieSchema);
