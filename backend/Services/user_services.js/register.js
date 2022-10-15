// ## 2- sign up (hash password)

const userModel = require("../../models/user_model")
const bcrypt = require('bcrypt');
const saltRounds = 4;

const register = async (req,res) => {
    const {userName,email,password,repassword,age,phone} = req.body
    const checkUser = await userModel.findOne({email})
    if (checkUser) {
        res.json({message: "email already exists"})
    }
    else {
        // await userModel.insertMany({userName,email,password,age,phone})
        // res.json({message: "registered"})

        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (!err) {
                await userModel.insertMany({userName,email,password:hash,age,phone})
                res.json({message: "registered"})
            }
            else {
                res.json({message: "bcrypt error" , err})
            }
        });
    }
}

module.exports = register