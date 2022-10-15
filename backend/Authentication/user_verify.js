const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

const userVerify = (req,res,next) => {
    const commingToken = req.header('userToken')
    jwt.verify(commingToken, 'new sos', function(err, decoded) {
        if (!err) {
            req.userId = decoded.userId
            next()
        }
        else {
            res.json({message: "incorrect token"})
        }
      });
}



module.exports = userVerify