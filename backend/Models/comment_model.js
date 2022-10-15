const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    content     : String,
    commentedBy : {
        type: mongoose.SchemaTypes.ObjectId,
        ref : 'user'
    }
})

const commentModel = mongoose.model('comment' , commentSchema)

module.exports = commentModel


// ## Comments has (content, createdBy=> ref to user model)