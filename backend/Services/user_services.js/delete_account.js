// ## 5- delete account (with posts and comments created by this account) (user must be logged in)(Get user ID from token)

const userModel = require("../../models/user_model")
const bcrypt = require('bcrypt');
const postModel = require("../../models/post_model");
const commentModel = require("../../models/comment_model");


const deleteAccount = async (req,res) => {
    const {email,password} = req.body
    const getUser = await userModel.findById({_id:req.userId}) 
    if (getUser.email == email) {
        bcrypt.compare(password, getUser.password, async (err, result) => {
            if (!err) {
                if (result) {
                    const getUserPosts = await postModel.find({postedBy:req.userId})
                    getUserPosts.forEach( post => {
                        const postComments = post.commentsOnpost
                        postComments.forEach( async commentId => {
                        await commentModel.findByIdAndDelete({_id:commentId})
                        });
                    } )
                    await postModel.deleteMany({postedBy:req.userId})
                    await commentModel.deleteMany({commentedBy:req.userId})
                    await userModel.findByIdAndDelete({_id:req.userId}) 
                    res.json({message: 'account deleted'})            
                }
                else {
                    res.json({message: "incorrect password"})
                }
            }
            else {
                res.json({message: "delet account bcrypt error" , err})
            }            
        });    
    }
    else {
        res.json({message: "incorrect email"})
    }
}

module.exports = deleteAccount