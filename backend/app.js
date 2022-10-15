const express = require('express')
const app = express()
const port = 6006
const cors = require('cors')
app.use(cors())

app.use(express.json())


const mongoConnect = require('./DataBase/db_connection')

app.use('/user' , require('./APIs/user_api'))
app.use('/posts' , require('./APIs/post_api'))
app.use('/comments' , require('./APIs/comment_api'))

app.listen(port , ()=>{
    console.log(`${port} is running`);
})

app.use('*' , (req,res)=> {
    res.json({message: "404 page not found"})
})

