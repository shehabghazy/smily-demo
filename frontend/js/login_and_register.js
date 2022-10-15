"use strict"

const displayRegisterSectionBtn = document.getElementById('displayRegisterSectionBtn')
const registerSection = document.getElementById('registerSection')
const loginSection = document.getElementById('loginSection')

displayRegisterSectionBtn.addEventListener('click' , ()=>{
    loginSection.classList.add('d-none')
    registerSection.classList.remove('d-none')
    emailLoginInput.value = ""
    passwordLoginInput.value = ""
})


// ----- REGISTER SECTION ------------------------------------------------------------
const userNameRegisterInput = document.getElementById('userNameRegisterInput')
const emailRegisterInput = document.getElementById('emailRegisterInput')
const passwordRegisterInput = document.getElementById('passwordRegisterInput')
const passwordConfirmationRegisterInput = document.getElementById('passwordConfirmationRegisterInput')
const ageRegisterInput = document.getElementById('ageRegisterInput')
const phoneRegisterInput = document.getElementById('phoneRegisterInput')
const registerBtn = document.getElementById('registerBtn')
const registerAert = document.getElementById('registerAert')
const displayLoginSectionBtn = document.getElementById('displayLoginSectionBtn')


// --- Register Inputs Validation ---
registerInputsValidation()
let userNameErrAdded = false, emailErrAdded = false, passwordErrAdded = false,passwordConfirmErrAdded = false, ageErrAdded = false , phoneErrAdded = false
function registerInputsValidation() {
    userNameRegisterInput.addEventListener('keyup' , userNameValid)
    emailRegisterInput.addEventListener('keyup' , emailValid)
    passwordRegisterInput.addEventListener('keyup' , passwordValid)
    passwordConfirmationRegisterInput.addEventListener('keyup' , repasswordValid)
    ageRegisterInput.addEventListener('keyup' , ageValid)
    phoneRegisterInput.addEventListener('keyup' , phoneValid)
    
    function userNameValid() {
        const regex = /^[a-zA-Z0-9 ]{3,20}$/
        if(regex.test(userNameRegisterInput.value)) {
            createRegisterErrSection("userNameErr" , userNameRegisterInput , false)
            userNameErrAdded = false
        } 
        else {
            createRegisterErrSection("userNameErr" , userNameRegisterInput , true ,"First and Last Name should be between 3 and 20 letters.")
            userNameErrAdded = true     
        }
    }    
    function emailValid() {
        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        if (regex.test(emailRegisterInput.value)) {
            createRegisterErrSection("emailErr" , emailRegisterInput , false)
            emailErrAdded = false
        } 
        else {
            createRegisterErrSection("emailErr" , emailRegisterInput , true ,"Enter a valid email please.")
            emailErrAdded = true
        }
    }
    function passwordValid() {
        const regex = /^[a-zA-Z0-9]{9,30}$/
        if (regex.test(passwordRegisterInput.value)) {
            createRegisterErrSection("passwordErr" , passwordRegisterInput , false)
            passwordErrAdded = false
        } 
        else {
            createRegisterErrSection("passwordErr" , passwordRegisterInput , true ,"Password should be more than 9 letters.")
            passwordErrAdded = true
        }
    }
    function repasswordValid() {
        if (passwordConfirmationRegisterInput.value == passwordRegisterInput.value) {
            createRegisterErrSection("repasswordErr" , passwordConfirmationRegisterInput , false)
            passwordConfirmErrAdded = false
        } 
        else {
            createRegisterErrSection("repasswordErr" , passwordConfirmationRegisterInput , true ,"Incorrect.")
            passwordConfirmErrAdded = true
        }
    }
    function ageValid() {
        const regex = /^(1[6-9]|[2-5][0-9]|60)$/
        if (regex.test(Number(ageRegisterInput.value))) {
            createRegisterErrSection("ageErr" , ageRegisterInput , false)
            ageErrAdded = false
        } 
        else {
            createRegisterErrSection("ageErr" , ageRegisterInput , true ,"Age should be between 16 and 60 years old.")
            ageErrAdded = true
        }
    } 
    function phoneValid() {
        const regex = /^01[0125][0-9]{8}$/
        if (regex.test(phoneRegisterInput.value)) {
            createRegisterErrSection("phoneErr" , phoneRegisterInput , false)
            phoneErrAdded = false
        } 
        else {
            createRegisterErrSection("phoneErr" , phoneRegisterInput , true ,"Phone numner should be egyptian. -not required-")
            phoneErrAdded = true
        }
    } 
}

function createRegisterErrSection(errId, inputErr , errCase , message) { 
    const errDiv = document.createElement('p')
    errDiv.id = errId
    errDiv.classList = "text-danger text-start fs-7 text-capitalize"
    const errMesaage = document.createTextNode(message)
    errDiv.appendChild(errMesaage)
    const errMsg = document.getElementById(errId)
    if (errCase == true) {
        if (!userNameErrAdded && errDiv.id == "userNameErr") {
            inputErr.classList.remove('is-valid')
            inputErr.after(errDiv)
        }
        if (!emailErrAdded && errDiv.id == "emailErr") {
            inputErr.classList.remove('is-valid')
            inputErr.after(errDiv)           
        }
        if (!passwordErrAdded && errDiv.id == "passwordErr") {
            inputErr.classList.remove('is-valid')
            inputErr.after(errDiv)           
        }
        if (!passwordConfirmErrAdded && errDiv.id == "repasswordErr") {
            inputErr.classList.remove('is-valid')
            inputErr.after(errDiv)           
        }
        if (!ageErrAdded && errDiv.id == "ageErr") {
            inputErr.classList.remove('is-valid')
            inputErr.after(errDiv)           
        }
        if (!phoneErrAdded && errDiv.id == "phoneErr") {
            inputErr.classList.remove('is-valid')
            inputErr.after(errDiv)           
        }
        allInputsIsvalid()
    }
    else if (errCase == false) {
        inputErr.classList.add('is-valid')
        if (errMsg) {
            errMsg.remove()
        } 
        allInputsIsvalid()
    }
}
function allInputsIsvalid() {
    if (Array.from(userNameRegisterInput.classList).includes('is-valid') &&
        Array.from(emailRegisterInput.classList).includes('is-valid') &&
        Array.from(passwordRegisterInput.classList).includes('is-valid') &&
        Array.from(passwordConfirmationRegisterInput.classList).includes('is-valid') &&
        Array.from(ageRegisterInput.classList).includes('is-valid') 
    ) {
        if (Array.from(phoneRegisterInput.classList).includes('is-valid') || phoneRegisterInput.value == "") {
            registerBtn.classList.remove('disabled')
        }
        else {
            if (!Array.from(registerBtn.classList).includes('disabled')) {
                registerBtn.classList.add('disabled')
            }
        }
    }
    else {
        if (!Array.from(registerBtn.classList).includes('disabled')) {
            registerBtn.classList.add('disabled')
        }
    }
}

// --- Send User Data To Register ---
function register() {
    let newUser = {
        userName  : userNameRegisterInput.value ,
        email     : emailRegisterInput.value,
        password  : passwordRegisterInput.value,
        repassword: passwordConfirmationRegisterInput.value,
        age       : Number(ageRegisterInput.value),
    }
    if (phoneRegisterInput.value != "") {
        newUser.phone = phoneRegisterInput.value
    }
    fetch(`http://localhost:6006/user/register`, {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newUser),
      })
    .then((response) => response.json())
    .then((res) => {
        console.log(res);
        if (res.message == "email already exists") {
            registerAert.classList.remove('d-none','text-info')
            registerAert.classList.add('text-danger')
            registerAert.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> This email has already registered.. You should enter another one.`
        }
        else if (res.message == "registered"){
            registerAert.classList.remove('d-none','text-danger')
            registerAert.classList.add('text-info')
            registerAert.innerHTML = `<i class="fa-solid fa-circle-check"></i> Congratulations.. you have registered successfully.. Log in Smiley now :)`
        }
    })
    .catch((error) => {
    //   console.error('Error:', error);
    });
}
registerBtn.addEventListener('click' , register )

// --- Go To Log in Section ---
displayLoginSectionBtn.addEventListener('click' , ()=>{
    registerSection.classList.add('d-none')
    loginSection.classList.remove('d-none')
    userNameRegisterInput.value = ""
    emailRegisterInput.value = ""
    passwordRegisterInput.value = ""
    passwordConfirmationRegisterInput.value = ""
    ageRegisterInput.value = ""
})


// ----- LOG IN SECTION ------------------------------------------------------------ bg-info
const emailLoginInput = document.getElementById('emailLoginInput')
const passwordLoginInput = document.getElementById('passwordLoginInput')
const loginBtn = document.getElementById('loginBtn')
const loginAlert = document.getElementById('loginAlert')
const toUserProfile = document.getElementById('toUserProfile')

function login() {
    // event.preventDefault()
    loginAlert.classList.add('d-none')

    if (!emailLoginInput.value || !passwordLoginInput.value) {
        loginAlert.classList.remove('d-none')
        loginAlert.innerHTML = `Enter your email and password please.`
    }
    else {
        const currentUser = {
            email      : emailLoginInput.value,
            password   : passwordLoginInput.value,
        }
        fetch(`http://localhost:6006/user/login`, {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(currentUser),
            })
            .then((response) => response.json())
            .then((res) => {
                // console.log(res);
                if (res.message == "Email doesn't exist") {
                    loginAlert.classList.remove('d-none')
                    loginAlert.innerHTML = `This email has not registered yet.`
                }
                else if (res.message == "incorrect password"){
                    passwordLoginInput.value = ""
                    loginAlert.classList.remove('d-none')
                    loginAlert.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> The password that you've entered is incorrect.`
        
                }
                else if (res.message == "log in") {
                    loginAlert.classList.add('d-none')
                    localStorage.setItem('userToken' , res.token)
                    location.href = "space.html";

                }
            })
            .catch((error) => {
            console.error('Error:', error);
            loginAlert.classList.remove('d-none')
            loginAlert.innerHTML = `Something went wrong.. please try again.`

            });





    }
    
}
loginBtn.addEventListener('click' , login )


