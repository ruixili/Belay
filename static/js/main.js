console.log("js is working");

var loginPage = document.getElementById("login-page");
var signupPage = document.getElementById("signup-page");
var forgetPasswordPage = document.getElementById("forget-password-page");
var changePasswordPage = document.getElementById("change-password-page");
var channelPage = document.getElementById("channel-page");

let pathname = window.location.pathname;
console.log("pathname: ", pathname);

// login page
if (pathname == "/") {
    console.log("in login page");
    loginPage.style.display = "block";

} else {
    // change password
    console.log("in change password page");
    window.history.pushState(null, null, url="/");
    loginPage.style.display = "none";
    changePasswordPage.style.display = "block";
}


/*
    login page
*/
$("#login-login-btn").click(function() {
    let email = $("#login-login-email").val();
    let password = $("#login-login-password").val();
    console.log(email, password);

    $.ajax({
        async: true,
        type: "POST",
        url: "/api/login",
        data: {
            "email": email,
            "password": password
        },
        success: function(status) {
            console.log(status);
            if (status == false) {
                alert("Unable to login!");
            } else {
                loginPage.style.display = "none";
                let loadPage = new Promise((resolve, reject) => {
                    channelPage.style.display = "block";
                    console.log("I am getting Sidebar channel");
                    getSidebarChannel(email);
                    window.setTimeout(
                        function() {
                            resolve("Success!");
                        }, 1000);
                })

                loadPage.then((successMessage) => {
                    let channelName = document.getElementById("chat-page-title-name").innerText;
                    console.log("I am loading message for Channel: " + channelName);
                    firstLoadMessage(channelName);
                });
            }
        }
    });
});

$("#login-signup").click(function() {
    console.log("in signup page");
    loginPage.style.display = "none";
    signupPage.style.display = "block";
});

$("#login-forget-password").click(function() {
    console.log("in forget password page");
    loginPage.style.display = "none";
    forgetPasswordPage.style.display = "block";
});


/*
    signup page
*/

$("#login-signup-btn").click(function() {
    console.log("singup the user");
    let email = $("#login-signup-email").val();
    let username = $("#login-signup-username").val();
    let password = $("#login-signup-password").val();
    let passwordAgain = $("#login-signup-password-again").val();

    if (password != passwordAgain) {
        alert("The passwords don't match!");
        return;
    }
    console.log(email, username, password);
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/signup",
        data: {
            "email": email,
            "username": username,
            "password": password
        },
        success: function(status) {
            let loadPage = new Promise((resolve, reject) => {
                signupPage.style.display = "none";
                loginPage.style.display = "block";
                window.setTimeout(
                    function() {
                        resolve("Success!");
                    }, 500);
            })

            loadPage.then((successMessage) => {
                alert(status);
            });   
        }
    });
});


/*
    forget password page
*/

$("#forget-password-btn").click(function() {
    console.log("the user forget the password and send link to the user");
    let email = $("#forget-password-email").val();

    $.ajax({
        async: true,
        type: "POST",
        url: "/api/forgetpassword",
        data: {
            "email": email
        },
        success: function(status) {
            let loadPage = new Promise((resolve, reject) => {
                forgetPasswordPage.style.display = "none";
                loginPage.style.display = "block";
                window.setTimeout(
                    function() {
                        resolve("Success!");
                    }, 500);
            })

            loadPage.then((successMessage) => {
                alert(status);
            });   
        }
    });
});

/*
    change password page
*/

$("#change-password-btn").click(function() {
    console.log("the user change the password");
    let email = $("#change-password-email").val();
    let password = $("#change-password-password").val();
    let passwordAgain = $("#change-password-password-again").val();

    if (password != passwordAgain) {
        alert("The passwords don't match!");
        return;
    }
    console.log(email, password);

    $.ajax({
        async: true,
        type: "POST",
        url: "/api/changepassword",
        data: {
            "email": email,
            "password": password
        },
        success: function(status) {
            let loadPage = new Promise((resolve, reject) => {
                changePasswordPage.style.display = "none";
                loginPage.style.display = "block";
                window.setTimeout(
                    function() {
                        resolve("Success!");
                    }, 500);
            })

            loadPage.then((successMessage) => {
                alert(status);
            });
        }
    });
});

/*
    channel page
*/

// Sidebar

// chat-page
$("#chat-page-more-message-btn").click(function() {
    let channelName = document.getElementById("chat-page-title-name").innerText;
    console.log("User wants to load more messages for channel: ", channelName);

    let messageIDs = document.querySelectorAll("#msg-id");
    let firstMessageDiv = messageIDs[0];

    if (firstMessageDiv) {
        firstMessageID = firstMessageDiv.innerText;
    } else {
        return;
    }

    console.log("the user wants to load more messages for channel: ", channelName);
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/moremessage",
        data: {
            "channelName": channelName,
            "firstLoad": false,
            "firstMessageID": firstMessageID
        },
        success: function(messages) {
            console.log("the messages from api" + messages);
            if (messages.length == 0) {
                console.log("going to remove the btn");
                removeMoremessage();
                return;
            } else {
                insertWords(messages);
            }
        }
    });
});

$("#chat-page-send-text-area").keypress(function(e) {
    if (e.which === 13) {
        sendMessage();
    }
});

$("#chat-page-send-btn").click(function() {
    sendMessage();
});

function sendMessage() {
    let channelName = document.getElementById("chat-page-title-name").innerText;
    let message = document.getElementById("chat-page-send-text-area").value;

    console.log("The user send a message to Channel: " + channelName + " : " + message);
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/postmessage",
        data: {
            "channelName": channelName,
            "email": "rxli@uchicago.edu", // localStorage?
            "message": message
        },
        success: function(messages) {
            console.log(messages);
            document.getElementById("chat-page-send-text-area").value = '';
        }
    });
}