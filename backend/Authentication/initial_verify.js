const jwt = require('jsonwebtoken')


const InitialVerify = (req,res) => {
    const commingToken = req.header('userToken')
    jwt.verify(commingToken, 'new sos', function(err, decoded) {
        if (!err) {
            req.userId = decoded.userId
            res.json({message: "cross the page"})
        }
        else {
            res.json({message: "incorrect token"})
        }
      });
}

module.exports = InitialVerify