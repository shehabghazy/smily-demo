// ## 4- update account   (user must be logged in)(Get user ID from token)

const userModel = require("../../models/user_model")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const updateAccount = async (req,res) => {
    const {userName,email,password,age,phone} = req.body
    const getUser = await userModel.findById({_id:req.userId}) 
    bcrypt.compare(password, getUser.password, async (err, result) => {
        if (!err) {
            if (result) {
                await userModel.findByIdAndUpdate({_id:req.userId},{userName,email,age,phone}) 
                const getUserAfterUpdate = await userModel.findById({_id:req.userId}) 
                const tokenData = {
                    userId  : getUserAfterUpdate._id,
                    userName: getUserAfterUpdate.userName,
                    email   : getUserAfterUpdate.email,
                    age     : getUserAfterUpdate.age, 
                    phone   : getUserAfterUpdate.phone
                }
                const token = jwt.sign(tokenData, 'new sos');
                res.json({message: 'account updated' , token})            
            }
            else {
                res.json({message: "incorrect password"})
            }
        }
        else {
            res.json({message: "update account bcrypt error" , err})
        }            
    });
}

module.exports = updateAccount