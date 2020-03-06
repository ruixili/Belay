console.log("js is working");

var loginPage = document.getElementById("login-page");
var signupPage = document.getElementById("signup-page");
var forgetPasswordPage = document.getElementById("forget-password-page");
var changePasswordPage = document.getElementById("change-password-page");
var channelPage = document.getElementById("channel-page");

let pathname = window.location.pathname;
console.log("pathname: ", pathname);

// // login page
// if (pathname == "/") {
//     console.log("in login page");
//     loginPage.style.display = "block";
// } else {
//     // change password
//     console.log("in change password page");
//     window.history.pushState(null, null, url="/");
//     loginPage.style.display = "none";
//     changePasswordPage.style.display = "block";
// }


/*
    login page
*/
$("#login-login-btn").click(function() {
    e.preventDefault();
    let email = $("#login-login-email").val();
    let password = $("#login-login-password").val();
    $.ajax({
        async: true,
        type: "POST",
        url: "/login",
        data: {
            email: email,
            password: password
        },
        success: function(status) {
            console.log(status);
            if (status.login == false) {
                alert("Unable to login!");
            } else {
                loginPage.style.display = "none";
                channelPage.style.display = "block";

                // let loadPage = new Promise((resolve, reject) => {
                //     fm.setStatus(STATUS.CHAT);
                //     fm.userInfo = {'username': status['username'], 'email': email, 'token': status['token'], 'photourl': status['photourl'] };
                //     window.setTimeout(
                //         function() {
                //             resolve("Success!");
                //         }, 1000);
                // })

                // loadPage.then((successMessage) => {
                //     // load new message for the channel
                //     let channel_name = document.getElementById("channel-name").innerText;
                //     console.log("I am loading message for" + channel_name);
                //     firstLoadMessage(channel_name);
                // });
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
    console.log("the user wants to load more messages");
});

$("#chat-page-send-btn").click(function() {
    console.log("the user send a message");
});