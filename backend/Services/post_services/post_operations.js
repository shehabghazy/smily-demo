// ## 1- add post  (user must be logged in)(Get user ID from token)
// ## 2- update post  (user must be logged in)(Get user ID from token) (post owner only)
// ## 3- Get all posts (with created by details and comments details using populate) (user must be logged in)
// ## 4- Get user posts (with created by details and comments details using populate) (user must be logged in)(Get user ID from token)
// ## 5- Delete Post with its comments (user must be logged in)(Get user ID from token) (post owner only)

const postModel = require("../../models/post_model")
const commentModel = require("../../models/comment_model")


const addPost = async (req,res) => {
    const postedBy = req.userId 
    const {title,content} = req.body
    if (title && content) {
        await postModel.insertMany({title,content,postedBy})
        res.json({message: "post added"})    
    }
    else {
        res.json({message: "can't add post with empty title or content"})    
    }
}

const updatePost = async (req,res) => {
    const {title,content} = req.body
    if (title && content) {
        const catchPost = req.header('postId')
        if (catchPost) {
            const getPost = await postModel.findById({_id:catchPost})
            if (getPost.postedBy == req.userId) {
                await postModel.findByIdAndUpdate({_id:catchPost},{title,content})
                res.json({message: "post updated"})
            }
            else {
                res.json({message: "just owner can update the post"})
            }
        }
        else {
            res.json({message: "postId not found"})
        }
    }
    else {
        res.json({message: "can't update post to empty title or content"})    
    }
}

const deletePost = async (req,res) => {
    const catchPost = req.header('postId')
    if (catchPost) {
        const getPost = await postModel.findById({_id:catchPost})
        if (getPost.postedBy == req.userId) {
            const postComments = getPost.commentsOnpost
            postComments.forEach( async commentId => {
               await commentModel.findByIdAndDelete({_id:commentId})
            });
            await postModel.findByIdAndDelete({_id:catchPost})
            res.json({message: "post deleted"})
        }
        else {
            res.json({message: "just owner can delete the post"})
        }
    }
    else {
        res.json({message: "postId not found"})
    }
    
}

const allPosts = async (req,res) => {
    const posts = await postModel.find({}).populate('postedBy','userName')
    .populate([
        {
          path: "commentsOnpost",
          model: "comment",
          select: "",
          populate: {
		    path: 'commentedBy',
			model: 'user',
            select: "userName",
		  }
        },
      ])
      
    if (posts.length != 0) {
        res.json({message: "all posts" , posts})
    }
    else {
        res.json({message: "no posts"})
    }
}

const userPosts = async (req,res) => {
    const userId = req.userId
    const posts = await postModel.find({postedBy:userId}).populate('postedBy','userName')
    .populate([
        {
          path: "commentsOnpost",
          model: "comment",
          select: "",
          populate: {
		    path: 'commentedBy',
			model: 'user',
            select: "userName",
		  }
        },
    ])



    if (posts.length != 0) {
        res.json({message: "user posts" , posts})
    }
    else {
        res.json({message: "user have no posts"})
    }
}

const anotherUserPosts = async (req,res) => {
    const userId = req.params.id
    const posts = await postModel.find({postedBy:userId}).populate('postedBy','userName')
    .populate([
        {
          path: "commentsOnpost",
          model: "comment",
          select: "",
          populate: {
		    path: 'commentedBy',
			model: 'user',
            select: "userName",
		  }
        },
    ])

    if (posts.length != 0) {
        res.json({message: "user posts" , posts})
    }
    else {
        res.json({message: "user have no posts"})
    }
}


module.exports = {addPost,updatePost,deletePost,userPosts,allPosts,anotherUserPosts}