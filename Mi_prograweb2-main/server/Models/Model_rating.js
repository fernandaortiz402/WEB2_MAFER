const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({ 
        Calificacion:{
        type: Number,
        required: true
    },
    movie: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movies'
        },
     user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        }  
});
module.exports = mongoose.model('Rating', ratingSchema);