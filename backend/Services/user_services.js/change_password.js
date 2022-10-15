// ## 3-Change password  (user must be logged in)(Get user ID from token)

const userModel = require("../../models/user_model")
const bcrypt = require('bcrypt');
const saltRounds = 4;

const changePass = async (req,res) => {
    const {currentPass,newPass,reNewPass} = req.body
    const getUser = await userModel.findById({_id : req.userId})
    bcrypt.compare(currentPass, getUser.password, async (err, result) => {
        if (!err) {
            if (result) {
                bcrypt.hash(newPass, saltRounds, async (err, hash) => {
                    if (!err) {
                        bcrypt.compare(newPass, getUser.password, async (err, result) => {
                            if (!err) {
                                if (result) {
                                    res.json({message: "same current pass" })
                                }
                                else {
                                    await userModel.findByIdAndUpdate({_id : req.userId} ,{password:hash} )
                                    res.json({message: "change password" })
                                }
                            }
                            else {
                                res.json({message: "change password bcrypt error - error in comparing current pass with new pass-" , err})
                            }
                        })
                    }
                    else {
                        res.json({message: "change password bcrypt error - error in hashing new password -" , err})
                    }           
                });
            }
            else {
                res.json({message: "incorrect password"})
            }
        }
        else {
            res.json({message: "change password bcrypt error - error in comparing current pass with user pass -" , err})
        }
    });
}

module.exports = changePass
