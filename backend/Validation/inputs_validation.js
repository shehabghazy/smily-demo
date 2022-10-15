const joi = require('joi');

const registerValidSchema = joi.object({
    userName  : joi.string().pattern(/^[a-zA-Z0-9 ]{3,20}$/).required(),
    email     : joi.string().pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).required(), 
    password  : joi.string().pattern(/^[a-zA-Z0-9]{9,30}$/),
    repassword: joi.ref('password'),
    age       : joi.number().min(16).max(60).required(),
    phone     : joi.string().pattern(/^01[0125][0-9]{8}$/)
})
const deleteAccountValidSchema = joi.object({
    email: joi.string().pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
    password: joi.string().pattern(/^[a-zA-Z0-9]{9,}$/),
})
const updateAccountValidSchema = joi.object({
    userName  : joi.string().pattern(/^[a-zA-Z0-9 ]{3,20}$/),
    email     : joi.string().pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/), 
    password  : joi.string().pattern(/^[a-zA-Z0-9]{9,30}$/),
    age       : joi.number().min(16).max(60),
    phone     : joi.string().pattern(/^01[0125][0-9]{8}$/)
})
const changePasswordValidSchema = joi.object({
    currentPass  : joi.string().pattern(/^[a-zA-Z0-9]{9,30}$/).required(),
    newPass  : joi.string().pattern(/^[a-zA-Z0-9]{9,30}$/).required(),
    reNewPass: joi.ref('newPass'),
})

const valid = (req,res,next,validFor) => {
    let errArr = []
    const { error } = validFor.validate(req.body , {abortEarly:false});
    if (!error) {
        next()
    }
    else {
        error.details.forEach( err => {
            errArr.push(err.message)
        } )
        res.json({message: "not valid" , errArr})
    }
}

const registerValid = (req,res,next) => {
    valid(req,res,next,registerValidSchema)
} 

const deleteAccountValid = (req,res,next) => {
    valid(req,res,next,deleteAccountValidSchema)
} 

const updateAccountValid = (req,res,next) => {
    valid(req,res,next,updateAccountValidSchema)
} 

const changePasswordValid = (req,res,next) => {
    valid(req,res,next,changePasswordValidSchema)
} 


module.exports = {registerValid,updateAccountValid,changePasswordValid,deleteAccountValid}

