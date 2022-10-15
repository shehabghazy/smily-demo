const postRouter = require('express').Router()
const userVerify = require('../Authentication/user_verify')
const {addPost,updatePost,deletePost,userPosts,allPosts,anotherUserPosts} = require('../Services/post_services/post_operations')

postRouter.post('/' , userVerify , addPost)
postRouter.patch('/' , userVerify , updatePost)
postRouter.delete('/' , userVerify , deletePost)
postRouter.get('/' , userVerify , allPosts)
postRouter.get('/user' , userVerify , userPosts)
postRouter.get('/:id' , userVerify , anotherUserPosts)

module.exports = postRouter