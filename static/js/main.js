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
            if (status.login == false) {
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
});

/*
    forget password page
*/

$("#forget-password-btn").click(function() {
    console.log("the user forget the password and send link to the user");
});

/*
    change password page
*/

$("#change-password-btn").click(function() {
    console.log("the user change the password");
});

/*
    channel page
*/

// Sidebar

// chat-page
$("#chat-page-more-message-btn").click(function() {
    let channelName = document.getElementById("chat-page-title-name").innerText;
    console.log("the user wants to load more messages for channel: ", channelName);
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/moremessage",
        data: {
            "channelName": channelName,
            "firstLoad": false
        },
        success: function(messages) {
            console.log("the messages from api" + messages);
            if (!messages) {

                removeMoremessage();
                return;
            } else {
                insertWords(messages);
            }
            // getMessage(channelName);
        }
    });
});

$("#chat-page-send-btn").click(function() {
    console.log("the user send a message");
});