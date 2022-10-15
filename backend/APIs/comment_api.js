const commentRouter = require('express').Router()
const userVerify = require('../Authentication/user_verify')
const {addComment, updatecomment, deleteComment} = require('../Services/comment_services/comment_operations')


commentRouter.post('/' , userVerify , addComment)
commentRouter.patch('/' , userVerify , updatecomment)
commentRouter.delete('/' , userVerify , deleteComment)

module.exports = commentRouter