const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movies',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Media', mediaSchema);