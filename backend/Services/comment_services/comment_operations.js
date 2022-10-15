// ## 1- Add Comment  (user must be logged in)(Get user ID from token)
// ## 2- Update comment (user must be logged in)(Get user ID from token) (post owner only)
// ## 3- Delete comment from comments collection and from commentsArray of the post (user must be logged in)(Get user ID from token) (comment owner and post owner)

const commentModel = require("../../models/comment_model")
const postModel = require("../../models/post_model")

const addComment = async (req,res) => {
    const commentedBy = req.userId
    const commentedOn = req.header('postId')
    const getPost = await postModel.findById({_id:commentedOn})
    if (commentedOn) {
        const {content} = req.body
        if (content) {
            const dataToInsert = {content,commentedBy}
            await commentModel.insertMany(dataToInsert, async function(err,docsInserted){
                const addedCommentId = docsInserted[0]._id
                const currentComments = getPost.commentsOnpost
                currentComments.push(addedCommentId)
                await postModel.findByIdAndUpdate({_id:commentedOn},{commentsOnpost:currentComments})
                res.json({message: "comment added"})
            })

        }
        else {
            res.json({message: "can't add empty comment"})
        }
    }
    else {
        res.json({message: "postId not found"})
    }
    
    
}

const updatecomment = async (req,res) => {
    const {content} = req.body
    if (content) {
        const catchComment = req.header('commentId')
        if (catchComment) {
            const getComment = await commentModel.findById({_id:catchComment})
            if (getComment.commentedBy == req.userId) {
                await commentModel.findByIdAndUpdate({_id:catchComment},{content})
                res.json({message: "comment updated"})
            }
            else {
                res.json({message: "just owner can update the comment"})
            }
        }
        else {
            res.json({message: "commentId not found"})

        }  
    }
    else {
        res.json({message: "can't update to empty comment"})
    }
}

const deleteComment = async (req,res) => {
    const catchComment = req.header('commentId')
    const commentedOn = req.header('postId')

    if (catchComment && commentedOn) {
        const getPost = await postModel.findById({_id:commentedOn})
        const getComment = await commentModel.findById({_id:catchComment})
        if (getComment.commentedBy == req.userId || getPost.postedBy == req.userId) {
            const currentComments = getPost.commentsOnpost
            const commentIndex = currentComments.indexOf(catchComment)
            currentComments.splice(commentIndex,1)
            await postModel.findByIdAndUpdate({_id:commentedOn},{commentsOnpost:currentComments})

            await commentModel.findByIdAndDelete({_id:catchComment})
            res.json({message: "comment deleted"})
        }
        else {
            res.json({message: "just owner of comment or post can delete the comment"})
        }
    }
    else {
        res.json({message: "commentId or postId not found"})
    }
    
}





module.exports = {addComment,updatecomment,deleteComment}