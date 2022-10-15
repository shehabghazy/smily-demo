const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    userName : String ,
    email    : String,
    password : String ,
    age      : Number ,
    phone    : String
})

const userModel = mongoose.model('user' , userSchema)

module.exports = userModel


// ## User has (name ,email,password "hash password" ,age ,phone)