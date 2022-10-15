'use strict'

// ----- USER VERIFICATION ----------------------------------------------------------------------
let userInfo , userToken
function decodeToken() {
    userToken = localStorage.getItem('userToken')
    function parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    };
userInfo = parseJwt(userToken)
}
decodeToken()

function initialVerify() {
    fetch(`http://localhost:6006/user/initialverify`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'userToken': userToken
        },
      })
    .then((response) => response.json())
    .then((res) => {
        // console.log(res);
        if (res.message == "incorrect token") {
            localStorage.removeItem('userToken')
            location.href = "login_and_register.html";
        }
    })
    .catch((error) => {
    //   console.error('Error:', error);
    });
}
initialVerify()

const logoutBtn = document.getElementById('logoutBtn')
logoutBtn.addEventListener('click' , ()=>{
    localStorage.removeItem('userToken')
    location.href = "login_and_register.html";
})


// ----- CHOOSE SECTION -------------------------------------------------------------------------
const profileUserName = document.getElementById('profileUserName')

function displayProfileInfo() {
    profileUserName.innerHTML = userInfo.userName
}
displayProfileInfo()
const updateAccSection = document.getElementById('updateAccSection')
const changePasswordSection = document.getElementById('changePasswordSection')
const deleteAccSection = document.getElementById('deleteAccSection')
const updateAccSectionBtn = document.getElementById('updateAccSectionBtn')
const changePasswordSectionBtn = document.getElementById('changePasswordSectionBtn')
const deleteAccSectionBtn = document.getElementById('deleteAccSectionBtn')

updateAccSectionBtn.addEventListener('click', ()=> {
    updateAccSectionBtn.classList.add('active')
    changePasswordSectionBtn.classList.remove('active')
    deleteAccSectionBtn.classList.remove('active')
    updateAccSection.classList.remove('d-none')
    changePasswordSection.classList.add('d-none')
    deleteAccSection.classList.add('d-none') 
})

changePasswordSectionBtn.addEventListener('click', ()=> {
    updateAccSectionBtn.classList.remove('active')
    changePasswordSectionBtn.classList.add('active')
    deleteAccSectionBtn.classList.remove('active')
    updateAccSection.classList.add('d-none')
    changePasswordSection.classList.remove('d-none')
    deleteAccSection.classList.add('d-none')
})

deleteAccSectionBtn.addEventListener('click', ()=> {
    updateAccSectionBtn.classList.remove('active')
    changePasswordSectionBtn.classList.remove('active')
    deleteAccSectionBtn.classList.add('active')
    updateAccSection.classList.add('d-none')
    changePasswordSection.classList.add('d-none')
    deleteAccSection.classList.remove('d-none')
})


// -- UPDATE ACCOUNT SECTION  --------------------------------------------------------------
const userNameUpdateInput = document.getElementById('userNameUpdateInput')
const emailUpdateInput = document.getElementById('emailUpdateInput')
const ageUpdateInput = document.getElementById('ageUpdateInput')
const phoneUpdateInput = document.getElementById('phoneUpdateInput')
const updateBtn = document.getElementById('updateBtn')
const updateAert = document.getElementById('updateAert')
const confirmUpdateBtn = document.getElementById('confirmUpdateBtn')
const cancelUpdateBtn = document.getElementById('cancelUpdateBtn')
const updateAccountConfirmationPass = document.getElementById('updateAccountConfirmationPass')
const updateAcoountIncorrectPassAlert = document.getElementById('updateAcoountIncorrectPassAlert')

updateInputsValidation()
let userNameErrAdded = false, emailErrAdded = false, ageErrAdded = false , phoneErrAdded = false , passwordErrAdded = false
function updateInputsValidation() {
    userNameUpdateInput.addEventListener('keyup' , userNameValid)
    emailUpdateInput.addEventListener('keyup' , emailValid)
    ageUpdateInput.addEventListener('keyup' , ageValid)
    phoneUpdateInput.addEventListener('keyup' , phoneValid)
    
    function userNameValid() {
        const regex = /^[a-zA-Z0-9 ]{3,20}$/
        if(regex.test(userNameUpdateInput.value)) {
            createUpdateErrSection("userNameErr" , userNameUpdateInput , false)
            userNameErrAdded = false
        } 
        else {
            createUpdateErrSection("userNameErr" , userNameUpdateInput , true ,"name should be between 3 and 20 letters.")
            userNameErrAdded = true     
        }
    }    
    function emailValid() {
        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        if (regex.test(emailUpdateInput.value)) {
            createUpdateErrSection("emailErr" , emailUpdateInput , false)
            emailErrAdded = false
        } 
        else {
            createUpdateErrSection("emailErr" , emailUpdateInput , true ,"enter a valid email please.")
            emailErrAdded = true
        }
    }
    function ageValid() {
        const regex = /^(1[6-9]|[2-5][0-9]|60)$/
        if (regex.test(Number(ageUpdateInput.value))) {
            createUpdateErrSection("ageErr" , ageUpdateInput , false)
            ageErrAdded = false
        } 
        else {
            createUpdateErrSection("ageErr" , ageUpdateInput , true ,"age should be between 16 and 60 years old.")
            ageErrAdded = true
        }
    } 
    function phoneValid() {
        const regex = /^01[0125][0-9]{8}$/
        if (regex.test(phoneUpdateInput.value)) {
            createUpdateErrSection("phoneErr" , phoneUpdateInput , false)
            phoneErrAdded = false
        } 
        else {
            createUpdateErrSection("phoneErr" , phoneUpdateInput , true ,"phone numner should be egyption. -not required-")
            phoneErrAdded = true
        }
    } 
}

function createUpdateErrSection(errId, inputErr , errCase , message) { 
    const errDiv = document.createElement('p')
    errDiv.id = errId
    errDiv.classList = "text-danger text-start fs-7 text-capitalize"
    const errMesaage = document.createTextNode(message)
    errDiv.appendChild(errMesaage)
    const errMsgForUpdate = document.getElementById(errId)
    if (errCase == true) {
        if (!userNameErrAdded && errDiv.id == "userNameErr") {
            inputErr.classList.remove('is-valid')
            inputErr.after(errDiv)
        }
        if (!emailErrAdded && errDiv.id == "emailErr") {
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
        if (!passwordErrAdded && errDiv.id == "passwordErr") {
            inputErr.classList.remove('is-valid')
            inputErr.after(errDiv)           
        }
        anyInputIsValid()
    }
    else if (errCase == false) {
        inputErr.classList.add('is-valid')
        if (errMsgForUpdate) {
            errMsgForUpdate.remove()
        } 
        anyInputIsValid()
    }
}
function anyInputIsValid() {
    if (Array.from(userNameUpdateInput.classList).includes('is-valid') ||
        Array.from(emailUpdateInput.classList).includes('is-valid') ||
        Array.from(ageUpdateInput.classList).includes('is-valid') ||
        Array.from(phoneUpdateInput.classList).includes('is-valid')
    ) {
        updateBtn.classList.remove('disabled')
    }
    else {
        if (!Array.from(updateBtn.classList).includes('disabled')) {
            updateBtn.classList.add('disabled')
        }
    }
}

updateAccountConfirmationPass.addEventListener('keyup' , ()=> {
    if (updateAccountConfirmationPass.value != "") {
            const regex = /^[a-zA-Z0-9]{9,30}$/
            if (regex.test(updateAccountConfirmationPass.value)) {
                createUpdateErrSection("passwordErr" , updateAccountConfirmationPass , false)
                passwordErrAdded = false
                confirmUpdateBtn.classList.remove('disabled')
            } 
            else {
                createUpdateErrSection("passwordErr" , updateAccountConfirmationPass , true ,"password should be more than 9 letters.")
                passwordErrAdded = true
            }
    }
    else {
        confirmUpdateBtn.classList.add('disabled')
    }
})

function confirmUpdateSection() {
    updateAccountPopup.classList.remove('d-none')
    updateAert.classList.add('d-none')
}
updateBtn.addEventListener('click' , confirmUpdateSection )

cancelUpdateBtn.addEventListener('click', ()=>{
    updateAccountPopup.classList.add('d-none')
    updateAcoountIncorrectPassAlert.classList.add('d-none')
    updateAccountConfirmationPass.value = ""
})

function confirmUpdate() {
    let newInfo = {
        password: updateAccountConfirmationPass.value
    }
    if (userNameUpdateInput.value != "") {
        newInfo.userName = userNameUpdateInput.value
    }
    if (emailUpdateInput.value != "") {
        newInfo.email = emailUpdateInput.value
    }
    if (ageUpdateInput.value != "") {
        newInfo.age = Number(ageUpdateInput.value)
    }
    if (phoneUpdateInput.value != "") {
        newInfo.phone = phoneUpdateInput.value
    }
    fetch(`http://localhost:6006/user/update`, {
        method: 'PATCH', 
        headers: {
            'Content-Type': 'application/json',
            'userToken': userToken
        },
        body: JSON.stringify(newInfo),
      })
    .then((response) => response.json())
    .then((res) => {
        // console.log(res);
        if (res.message == "incorrect token") {
            localStorage.removeItem('userToken')
            location.href = "login_and_register.html";
        }
        else if (res.message == "account updated") {
            updateAcoountIncorrectPassAlert.classList.add('d-none')
            updateAccountPopup.classList.add('d-none')
            updateAert.classList.remove('d-none')
            localStorage.setItem('userToken' , res.token)
            decodeToken()
        }
        else if (res.message == "incorrect password"){
            updateAcoountIncorrectPassAlert.classList.remove('d-none')
        }
    })
    .catch((error) => {
    //   console.error('Error:', error);
    });
}
confirmUpdateBtn.addEventListener('click' , confirmUpdate )


// -- CHANGE PASSWORD SECTION  ------------------------------------------------------------
const currentPassInput = document.getElementById('currentPassInput')
const newPassInput = document.getElementById('newPassInput')
const newPassConfirmationInput = document.getElementById('newPassConfirmationInput')
const changePassAlert = document.getElementById('changePassAlert')
const changePassBtn = document.getElementById('changePassBtn')

changePassInputsValidation()
let currentPassErrAdded = false , newPassErrAdded = false , newPassConfirmErrAdded = false
function changePassInputsValidation() {
    currentPassInput.addEventListener('keyup' , currentPassValid)
    newPassInput.addEventListener('keyup' , newPassValid)
    newPassConfirmationInput.addEventListener('keyup' , newPassConfirmationValid)
    function currentPassValid() {
        const regex = /^[a-zA-Z0-9]{9,30}$/
        if (regex.test(currentPassInput.value)) {
            createChangePassErrSection("currentPassErr" , currentPassInput , false)
            currentPassErrAdded = false
        } 
        else {
            createChangePassErrSection("currentPassErr" , currentPassInput , true ,"password should be more than 9 letters.")
            currentPassErrAdded = true
        }
    }
    function newPassValid() {
        const regex = /^[a-zA-Z0-9]{9,30}$/
        if (regex.test(newPassInput.value)) {
            createChangePassErrSection("newPassErr" , newPassInput , false)
            newPassErrAdded = false
        } 
        else {
            createChangePassErrSection("newPassErr" , newPassInput , true ,"password should be more than 9 letters.")
            newPassErrAdded = true
        }
    }
    function newPassConfirmationValid() {
        if (newPassConfirmationInput.value == newPassInput.value) {
            createChangePassErrSection("newPassConfirmationErr" , newPassConfirmationInput , false)
            newPassConfirmErrAdded = false
        } 
        else {
            createChangePassErrSection("newPassConfirmationErr" , newPassConfirmationInput , true ,"incorrect.")
            newPassConfirmErrAdded = true
        }
    }    
}

function createChangePassErrSection(errId, inputErr , errCase , message) { 
    const errDiv = document.createElement('p')
    errDiv.id = errId
    errDiv.classList = "text-danger text-start fs-7 text-capitalize"
    const errMesaage = document.createTextNode(message)
    errDiv.appendChild(errMesaage)
    const errMsgForChangePass = document.getElementById(errId)
    if (errCase == true) {
        if (!currentPassErrAdded && errDiv.id == "currentPassErr") {
            inputErr.classList.remove('is-valid')
            inputErr.after(errDiv)           
        }
        if (!newPassErrAdded && errDiv.id == "newPassErr") {
            inputErr.classList.remove('is-valid')
            inputErr.after(errDiv)           
        }
        if (!newPassConfirmErrAdded && errDiv.id == "newPassConfirmationErr") {
            inputErr.classList.remove('is-valid')
            inputErr.after(errDiv)           
        }
        allInputsIsvalidForChangePass()
    }
    else if (errCase == false) {
        inputErr.classList.add('is-valid')
        if (errMsgForChangePass) {
            errMsgForChangePass.remove()
        } 
        allInputsIsvalidForChangePass()
    }
}
function allInputsIsvalidForChangePass() {
    if (Array.from(currentPassInput.classList).includes('is-valid') &&
        Array.from(newPassInput.classList).includes('is-valid') &&
        Array.from(newPassConfirmationInput.classList).includes('is-valid') 
        ) {
        changePassBtn.classList.remove('disabled')
    }
    else {
        if (!Array.from(changePassBtn.classList).includes('disabled')) {
            changePassBtn.classList.add('disabled')
        }
    }
}

function changePassword() {
    let newPassword = {
        currentPass: currentPassInput.value,
        newPass    : newPassInput.value,
        reNewPass  : newPassConfirmationInput.value,
    }
    fetch(`http://localhost:6006/user/newpassword`, {
        method: 'PATCH', 
        headers: {
            'Content-Type': 'application/json',
            'userToken': userToken
        },
        body: JSON.stringify(newPassword),
      })
    .then((response) => response.json())
    .then((res) => {
        // console.log(res);
        if (res.message == "incorrect token") {
            localStorage.removeItem('userToken')
            location.href = "login_and_register.html";
        }
        else if (res.message == "same current pass") {
            changePassAlert.classList.remove('d-none','text-info')
            changePassAlert.classList.add('text-danger')
            changePassAlert.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> The new password that you have entered is the same current password .. you should enter another one to change it.`
        }
        else if (res.message == "incorrect password") {
            changePassAlert.classList.remove('d-none','text-info')
            changePassAlert.classList.add('text-danger')
            changePassAlert.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> The current password that you have entered is incorrect.`
        }
        else if (res.message == "change password"){
            changePassAlert.classList.remove('d-none','text-danger')
            changePassAlert.classList.add('text-info')
            changePassAlert.innerHTML = `<i class="fa-solid fa-circle-check"></i> Password has been changed`
        }
    })
    .catch((error) => {
    //   console.error('Error:', error);
    });
}
changePassBtn.addEventListener('click' , changePassword )


// --- REMOVE ACCOUNT SECTION ------------------------------------------------------------

const emailRemoveAccInput = document.getElementById('emailRemoveAccInput')
const passRemoveAccInput = document.getElementById('passRemoveAccInput')
const removeAccBtn = document.getElementById('removeAccBtn')

removeAccInputsValidation()
let emailRemoveAccErrAdded = false , passRemoveAccErrAdded = false
function removeAccInputsValidation() {
    emailRemoveAccInput.addEventListener('keyup' , emailRemoveAccValid)
    passRemoveAccInput.addEventListener('keyup' , passRemoveAccValid)
    function emailRemoveAccValid() {
        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        if (regex.test(emailRemoveAccInput.value)) {
            createRemoveAccErrSection("emailRemoveAccErr" , emailRemoveAccInput , false)
            emailRemoveAccErrAdded = false
        } 
        else {
            createRemoveAccErrSection("emailRemoveAccErr" , emailRemoveAccInput , true ,"Enter a valid email please.")
            emailRemoveAccErrAdded = true
        }
    }
    function passRemoveAccValid() {
        const regex = /^[a-zA-Z0-9]{9,30}$/
        if (regex.test(passRemoveAccInput.value)) {
            createRemoveAccErrSection("passwordRemoveAccErr" , passRemoveAccInput , false)
            passRemoveAccErrAdded = false
        } 
        else {
            createRemoveAccErrSection("passwordRemoveAccErr" , passRemoveAccInput , true ,"Password should be more than 9 letters.")
            passRemoveAccErrAdded = true
        }
    }
      
}

function createRemoveAccErrSection(errId, inputErr , errCase , message) { 
    const errDiv = document.createElement('p')
    errDiv.id = errId
    errDiv.classList = "text-danger text-start fs-7 text-capitalize"
    const errMesaage = document.createTextNode(message)
    errDiv.appendChild(errMesaage)
    const errMsgForRemoveAcc = document.getElementById(errId)
    if (errCase == true) {
        if (!emailRemoveAccErrAdded && errDiv.id == "emailRemoveAccErr") {
            inputErr.classList.remove('is-valid')
            inputErr.after(errDiv)           
        }
        if (!passRemoveAccErrAdded && errDiv.id == "passwordRemoveAccErr") {
            inputErr.classList.remove('is-valid')
            inputErr.after(errDiv)           
        }
        allInputsIsvalidForRemoveAcc()
    }
    else if (errCase == false) {
        inputErr.classList.add('is-valid')
        if (errMsgForRemoveAcc) {
            errMsgForRemoveAcc.remove()
        } 
        allInputsIsvalidForRemoveAcc()
    }
}
function allInputsIsvalidForRemoveAcc() {
    if (Array.from(emailRemoveAccInput.classList).includes('is-valid') &&
        Array.from(passRemoveAccInput.classList).includes('is-valid')) {
        removeAccBtn.classList.remove('disabled')
    }
    else {
        if (!Array.from(removeAccBtn.classList).includes('disabled')) {
            removeAccBtn.classList.add('disabled')
        }
    }
}

function removeAccount() {
    let newPassword = {
        email   : emailRemoveAccInput.value,
        password: passRemoveAccInput.value,
    }
    fetch(`http://localhost:6006/user/delete`, {
        method: 'DELETE', 
        headers: {
            'Content-Type': 'application/json',
            'userToken': userToken
        },
        body: JSON.stringify(newPassword),
      })
    .then((response) => response.json())
    .then((res) => {
        // console.log(res);
        if (res.message == "incorrect email") {
            removeAccAlert.classList.remove('d-none','text-info')
            removeAccAlert.classList.add('text-danger')
            removeAccAlert.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Incorrect email.`
        }
        if (res.message == "incorrect password") {
            removeAccAlert.classList.remove('d-none','text-info')
            removeAccAlert.classList.add('text-danger')
            removeAccAlert.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Incorrect password.`
        }
        else if (res.message == "account deleted"){
            localStorage.removeItem('userToken')
            location.href = "login_and_register.html";
        }
    })
    .catch((error) => {
    //   console.error('Error:', error);
    });
}
removeAccBtn.addEventListener('click' , removeAccount )







