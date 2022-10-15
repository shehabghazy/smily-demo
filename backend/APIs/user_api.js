const changePass = require('../Services/user_services.js/change_password')
const login = require('../Services/user_services.js/login')
const register = require('../Services/user_services.js/register')
const updateAccount = require('../Services/user_services.js/update_account')
const deleteAccount = require('../Services/user_services.js/delete_account')
const { registerValid, deleteAccountValid, updateAccountValid , changePasswordValid} = require('../Validation/inputs_validation')
const userVerify = require('../Authentication/user_verify')
const InitialVerify = require('../Authentication/initial_verify')
const allUsers = require('../Services/user_services.js/all_users')
const userRouter = require('express').Router()

userRouter.post('/initialverify' , InitialVerify)
userRouter.get('/allusers' , userVerify , allUsers)
userRouter.post('/register' , registerValid , register)
userRouter.post('/login' , login)
userRouter.patch('/newpassword' , userVerify , changePasswordValid , changePass)
userRouter.patch('/update' , userVerify , updateAccountValid , updateAccount)
userRouter.delete('/delete' , userVerify , deleteAccountValid , deleteAccount)

module.exports = userRouter

/*
------------- register----
{
    "userName": "taha",
    "email": "taha@.com",
    "password": "123",
    "repassword": "123",
    "age": 18,
    "phone": "0100000000"
}


------------- log in----
{
    "email": "taha@gmail.com",
    "password": "123"
}




*/