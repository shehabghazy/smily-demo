const mongoose = require('mongoose')

const mongoConnect = mongoose.connect('mongodb://localhost:27017/friends_project')
.then(()=>{
    console.log(`DataBase is connected`);
})

module.exports = mongoConnect