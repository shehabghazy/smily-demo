const mongoose = require('mongoose')

const comment = mongoose.Schema({name:String})

const postSchema = mongoose.Schema({
    title     : String,
    content   : String,
    postedBy : {
        type: mongoose.SchemaTypes.ObjectId,
        ref : 'user'
    },
    commentsOnpost  : {
        type: Array,
        ref : 'comment'
    }
})



const postModel = mongoose.model('post' , postSchema)

module.exports = postModel


// ## posts has (title ,content,createdBy=> ref to user model , comments =>Array of ID ref to comment model )