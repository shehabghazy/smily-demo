const userModel = require("../../models/user_model")


const allUsers = async (req,res) => {
    const allUsers = await userModel.find({},{userName:1})
    if (allUsers.length != 0) {
        res.json({message: "all users" , allUsers})
    }
    else {
        res.json({message: "no users"})
    }
}

module.exports = allUsers