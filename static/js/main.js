console.log("js is working");

var email;
var usrename;


var loginPage = document.getElementById("login-page");
var signupPage = document.getElementById("signup-page");
var forgetPasswordPage = document.getElementById("forget-password-page");
var changePasswordPage = document.getElementById("change-password-page");
var channelPage = document.getElementById("channel-page");
var changeUsernamePage = document.getElementById("change-username-page");


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
    email = $("#login-login-email").val();
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
        success: function(repsonse) {
            console.log("The repsonse from login method: " + repsonse['data']);
            if (repsonse['data'] == null) {
                alert("Unable to login!");
            } else {
                // set token for this session
                document.cookie = "cookie=" + repsonse['token'];
                
                loginPage.style.display = "none";
                let loadPage = new Promise((resolve, reject) => {
                    channelPage.style.display = "block";
                    console.log("I am getting Sidebar channel");
                    getSidebarChannel();
                    window.setTimeout(
                        function() {
                            resolve(repsonse);
                        }, 2000);
                })

                loadPage.then((repsonse) => {
                    console.log("--------successMessage" + repsonse['data']);
                    let welcomeUsername = document.getElementById("sidebar-welcome-username");
                    welcomeUsername.innerText = "Username: " + repsonse['data'][0][1]; 
                    let welcomeEmail = document.getElementById("sidebar-welcome-email");
                    welcomeEmail.innerText = "Email: " + email;

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
    email = $("#login-signup-email").val();
    username = $("#login-signup-username").val();
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
    email = $("#forget-password-email").val();

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
    email = $("#change-password-email").val();
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
