// ## 1- sign in (send token)

const userModel = require("../../models/user_model")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req,res) => {
    const {email,password} = req.body
    const checkUser = await userModel.findOne({email})
    if (checkUser) {
        bcrypt.compare(password, checkUser.password, function(err, result) {
            if (!err) {
                if (result) {
                    const tokenData = {
                        userId  : checkUser._id,
                        userName: checkUser.userName,
                        email   : checkUser.email,
                        age     : checkUser.age, 
                        phone   : checkUser.phone
                    }
                    const token = jwt.sign(tokenData, 'new sos');
                    res.json({message: "log in" , token })
                }
                else {
                    res.json({message: "incorrect password"})
                }
            }
            else {
                res.json({message: "log in bcrypt error" , err})
            }            
        });
    }
    else {
        res.json({message: "Email doesn't exist"})
        // return res.redirect('index.html')
    }
}

module.exports = login