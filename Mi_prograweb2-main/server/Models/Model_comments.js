const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({ 
        Comentario:{
        type: String,
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

module.exports = mongoose.model('Comments', commentSchema);