'use strict'

// ----- USER VERIFICATION ------------------------------------------------------------------
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


// ----- DISPLAY USER POSTS WITH COMMENTS ------------------------------------------------------
const profileUserName = document.getElementById('profileUserName')
const profileUserEmail = document.getElementById('profileUserEmail')
const profileUserPhone = document.getElementById('profileUserPhone')
const profileUserAge = document.getElementById('profileUserAge')
const shareMyProfile = document.getElementById('shareMyProfile')
const displayWritingPostSectionBtn = document.getElementById('displayWritingPostSectionBtn')
const writingPostSection = document.getElementById('writingPostSection')
const postsContainer = document.getElementById('postsContainer')

displayWritingPostSectionBtn.addEventListener('click' , ()=>{
    writingPostSection.classList.remove('d-none')
})

function displayProfileInfo() {
    profileUserName.innerHTML = userInfo.userName
    profileUserEmail.innerHTML = userInfo.email;
    (userInfo.phone) ? profileUserPhone.innerHTML = userInfo.phone : profileUserPhone.innerHTML = `Not Added` 
    profileUserAge.innerHTML = userInfo.age
}
displayProfileInfo()
let allPosts , postComments , postIdArr , allCommentsArr;

async function getAllposts() {
    let finalRes
    const res = await fetch('http://localhost:6006/posts/user' , {
        headers: {
            'userToken': userToken,
          },
    })
    .then((response) => response.json())
    .then(res => {
        // console.log(res);
        if (res.message == "incorrect token") {
            localStorage.removeItem('userToken')
            location.href = "login_and_register.html";
        }
        finalRes = res
    })
    if (finalRes.message == "user posts") {
        allPosts = finalRes.posts.reverse()
        // console.log( 'posts', allPosts);
        postIdArr = []
        allPosts.forEach( post => {
            postIdArr.push(post._id)
        } )
        allCommentsArr = []
        allPosts.forEach( post => {
            allCommentsArr.push(post.commentsOnpost)
        } )
        displayAllPosts()  

    }
    else {
        displayIfNoPosts()
    }
    
}
getAllposts()

function displayIfNoPosts() {
    const noPosts = `
        <div class="p-5 fs-4 text-center">
            There is no any posts yet ..
        </div>`
    postsContainer.innerHTML = noPosts 
}

function displayAllPosts() {
    let postsPrepare = `` , commentPrepare
    for (let i = 0; i < allPosts.length; i++) {
        postComments = allPosts[i].commentsOnpost
        commentPrepare = ``
        if (postComments.length != 0) {
            for (let z = 0; z < postComments.length; z++) {
                commentPrepare += `
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-1 pt-3">
                            <img src="images/profile_pic.png" alt="" class="ms-1 w-100">      
                        </div>
                        <div class="col-11 comment-bg my-2 p-2 position-relative">
                            <span class="text-capitalize fs-7 text-info fw-semibold border-bottom border-dark">${postComments[z].commentedBy.userName}</span>
                            <span class="position-absolute end-0 mx-2"> 
                                <button id="deleteCommentBtn${i}${z}" onclick="deleteComment(${i},${z})" title="delete comment" class="btn btn-sm btn-outline-dark shadow-none border-0"><i class="fa-solid fa-trash"></i></button>
                                
                                <button  onclick="catchCommentToEdit(${i},${z})" title="edit comment" class="${userInfo.userId != allPosts[i].commentsOnpost[z].commentedBy._id?"d-none":""} btn btn-sm btn-outline-dark shadow-none border-0"><i class="fa-solid fa-marker"></i></button>
                            </span>
                            <p class="pt-2 ms-3">${postComments[z].content}</p>
                        </div>
                    </div>
                </div>`    
            }
        }
        postsPrepare += `
            <div class="bg-white border my-2 p-4 rounded-5 position-relative">
                <div class="btn-group position-absolute end-0 top-0" role="group">
                    <button type="button" class="btn btn-white rounded-5 mt-3 mx-3" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fa-solid fs-5 fa-ellipsis"></i>
                    </button>
                    <ul class="dropdown-menu shadow-sm rounded-4 rounded-start py-3">
                        <li><a class="dropdown-item cursor-on p-3"><i class="fa-solid fa-user mx-2"></i> Profile</a></li>
                        <li><a onclick="catchPostForEdit(${i})" href="#" class="dropdown-item ${userInfo.userId != allPosts[i].postedBy._id ? "d-none" : "" }  cursor-on p-3"><i class="fa-solid fa-pen-to-square mx-2"></i> Edit</a></li>
                        <li><a onclick="catchPostForDelete(${i})" class="dropdown-item cursor-on p-3 ${userInfo.userId != allPosts[i].postedBy._id ? "d-none" : "" }"><i class="fa-solid fa-trash mx-2"></i> Delete</a></li>

                        <li><a class="dropdown-item cursor-on  p-3"><i class="fa-regular fa-bookmark mx-2"></i> Save</a></li>
                        <li><a class="dropdown-item cursor-on  p-3"><i class="fa-solid fa-link mx-2"></i> Link to post</a></li>
                    </ul>
                </div>

                <h5 class="">${allPosts[i].title}</h5>
                <p class="">${allPosts[i].content}</p>
                <div class="border-top border-info border-2 pt-1 position-relative">
                    <div class="container">
                        <div class="row">
                            <div class="col-6">
                                <button id="" class="btn btn-sm btn-outline-dark shadow-none rounded-0 border-0 px-2 m-0" onclick="addComment(${i})"><i class="fa-regular fa-comment"></i> Add Comment</button>

                                <button id="commentEditBtn${i}"onclick="editComment()" class=" btn btn-sm btn-outline-dark shadow-none rounded-0 border-0 px-2 m-0 d-none">
                                        <i class="fa-regular fa-pen-to-square"></i> Edit
                                </button>
                                <button id="" class="btn btn-sm btn-outline-dark shadow-none rounded-0 border-0 px-2 m-0"><i class="fa-regular fa-share-from-square fw-s"></i> Share</button>

                            </div>
                            <div class="col-5 text-end">
                                <span class="text-capitalize fs-7 fw-semibold text-light bg-info p-2 rounded-3 pt-1 pe-3">${allPosts[i].postedBy.userName}</span>
                                <span class="handle-postWriter-photo position-absolute">
                                    <img src="images/profile_pic.png" class="w-100">      
                                </span>

                            </div>

                        </div>
                    </div>
                </div>

                <div>
                    <div id="commentTextAreaSection${i}" class="w-100 px-4 mt-2">
                        <textarea id="commentInput${i}" class="form-control handle-input rounded-5 px-4 py-2 overflow-visible" placeholder="Add your ideas about this..." rows="1"></textarea>   
                    </div>

                    <div id="deletePostConfirmation${i}" class=" bg-opacity-75 p-1 mx-4 mt-2 text-center d-none">       
                        <p class="m-1 text-secondary fw-semibold">Are you sure you want to delete this post from Smiley?</p>
                        <button type="button" class="btn btn-sm btn-outline-info my-2" onclick="confirmDeletingPost()">Delete</button>
                        <button type="button" class="btn btn-sm btn-outline-dark shadow-none my-2" onclick="cancelDeletingPost()">Cancel</button>
                    </div>

                    <div class="w-100 ">
                            ${commentPrepare}
                    </div>
                </div>   
            </div>`
  
    }
    postsContainer.innerHTML = postsPrepare
    for (let i = 0; i < allPosts.length; i++) {
        postComments = allPosts[i].commentsOnpost
        if (postComments.length != 0) {
            for (let z = 0; z < postComments.length; z++) {   
                const deleteCommentBtn = document.getElementById(`deleteCommentBtn${i}${z}`)
                if (userInfo.userId != postComments[z].commentedBy._id && userInfo.userId != allPosts[i].postedBy._id) {
                    deleteCommentBtn.classList.add('d-none')
                }
            }  
        }         
    }
}


// ----- POSTS OPERATIONS --------------------------------------------------------------------
const postTitleInput = document.getElementById('postTitleInput')
const postContentInput = document.getElementById('postContentInput')
const addPostBtn = document.getElementById('addPostBtn')
const resetPostInputsBtn = document.getElementById('resetPostInputsBtn')
const addingPostAlert = document.getElementById('addingPostAlert')
const editPostBtn = document.getElementById('editPostBtn')

let postIdForEdit , postIdForDelete , commentTextAreaSection , deletePostConfirmation

function resetPostInputs() {
    postTitleInput.value =""
    postContentInput.value =""
}
resetPostInputsBtn.addEventListener('click' , resetPostInputs)

function postOperations(sendingMethod, operation, postId) {
    let post
    if (operation == "add" || operation == "edit") {
        post = {
            title: postTitleInput.value,
            content: postContentInput.value
        }
        if (post.title && post.content) {
            passToDB()
        }
        else {
            addingPostAlert.classList.remove('d-none')
            addingPostAlert.innerHTML = "Title and content cannot be left empty"
        }
    }
    else if (operation == "delete") {
        passToDB()
    } 
    function passToDB() {
        fetch(`http://localhost:6006/posts`, {
            method: sendingMethod, 
            headers: {
                'Content-Type': 'application/json',
                'userToken': userToken,
                'postId' : postId
            },    
            body: JSON.stringify(post),
          })
        .then((response) => response.json())
        .then((res) => {
            // console.log(res);
            if (res.message == "incorrect token") {
                localStorage.removeItem('userToken')
                location.href = "login_and_register.html";
            }
            addingPostAlert.classList.add('d-none')
            editPostBtn.classList.add('d-none')
            resetPostInputs()
            getAllposts()
        })
        .catch((error) => {
        //   console.error('Error:', error);
          addingPostAlert.classList.remove('d-none')
          addingPostAlert.innerHTML = "Something went wrong.. please try again in few minutes"
        });
    }
}

addPostBtn.addEventListener('click' , () => {
    postOperations('POST' , 'add')
})

function catchPostForEdit(getIndex) {
    writingPostSection.classList.remove('d-none')

    postIdForEdit = postIdArr[getIndex]
    allPosts.forEach( post => {
        if (post._id == postIdForEdit) {
            postTitleInput.value = post.title
            postContentInput.value = post.content 
        }
    })
    editPostBtn.classList.remove('d-none')
    addingPostAlert.classList.remove('d-none')
    addingPostAlert.innerHTML = "You can make an edit or add it as a new post"
}

editPostBtn.addEventListener('click' , () => {
    postOperations('PATCH' , 'edit' , postIdForEdit)

} )

function catchPostForDelete(getIndex) {
    // console.log(getIndex);
    commentTextAreaSection = document.getElementById(`commentTextAreaSection${getIndex}`)
    deletePostConfirmation = document.getElementById(`deletePostConfirmation${getIndex}`)
    postIdForDelete = postIdArr[getIndex]   
    commentTextAreaSection.classList.add('d-none')
    deletePostConfirmation.classList.remove('d-none')
}

function confirmDeletingPost() {
    postOperations('DELETE' , 'delete' , postIdForDelete)
}

function cancelDeletingPost() {
    commentTextAreaSection.classList.remove('d-none')
    deletePostConfirmation.classList.add('d-none')
}


// ----- COMMENTS OPERATIONS ---------------------------------------------------------------
let postIdForAddComment , commentInput
function addComment(getIndex) {
    postIdForAddComment = postIdArr[getIndex]
    commentInput = document.getElementById(`commentInput${getIndex}`)
    const addCommentBtn = document.getElementById(postIdForAddComment)
    commentOperations('POST', 'add', postIdForAddComment)
}

let postIdForEditComment , commentIdForEditComment
function catchCommentToEdit(getPostIndex , getCommentIndex) {
    commentIdForEditComment = allPosts[getPostIndex].commentsOnpost[getCommentIndex]._id
    const comment = allPosts[getPostIndex].commentsOnpost[getCommentIndex]
    commentInput = document.getElementById(`commentInput${getPostIndex}`)
    commentInput.value = comment.content
    const commentEditBtn = document.getElementById(`commentEditBtn${getPostIndex}`)
    commentEditBtn.classList.remove('d-none')
}
function editComment() {
    commentOperations('PATCH', 'edit', postIdForEditComment , commentIdForEditComment)

}

let postIdForDeleteComment , commentIdForDeleteComment
function deleteComment(getPostIndex , getCommentIndex) {
    commentIdForDeleteComment = allPosts[getPostIndex].commentsOnpost[getCommentIndex]._id
    postIdForDeleteComment = postIdArr[getPostIndex]
    commentOperations('DELETE', 'delete', postIdForDeleteComment , commentIdForDeleteComment)
}

function commentOperations(sendingMethod, operation, postId, commentId) {
    let comment
    if (operation == "add" || operation == "edit") {
        comment = {
            content: commentInput.value
        }
        if (comment.content) {
            passToDB()
        }
        else {
            commentInput.placeholder = "Can't add an empty comment"
        }
    }
    else if (operation == "delete") {
        passToDB()
    } 
    function passToDB() {
        fetch(`http://localhost:6006/comments`, {
            method: sendingMethod, 
            headers: {
                'Content-Type': 'application/json',
                'userToken': userToken,
                'postId' : postId,
                'commentId' : commentId,
            },    
            body: JSON.stringify(comment),
          })
        .then((response) => response.json())
        .then((res) => {
            // console.log(res);
            if (res.message == "incorrect token") {
                localStorage.removeItem('userToken')
                location.href = "login_and_register.html";
            }
            getAllposts()
        })
        .catch((error) => {
        //   console.error('Error:', error);
        });
    }
}



