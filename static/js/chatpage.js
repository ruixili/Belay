/*
 * chat-page 
 */

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
            if (!messages || messages.length == 0) {
                console.log("going to hide the btn");
                hideMoremessage();
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
            "email": localStorage.getItem("email"), // localStorage?
            "message": message
        },
        success: function(messages) {
            console.log(messages);
            document.getElementById("chat-page-send-text-area").value = '';
        }
    });
}


function emptyChatArea() {
    let moreMessageDiv = document.getElementById("chat-page-more-message");
    console.log(moreMessageDiv);

    while (moreMessageDiv.nextSibling) {
        moreMessageDiv.parentNode.removeChild(moreMessageDiv.nextSibling);
    }

    moreMessageDiv.style.display = "block";
    console.log("moreMessageDiv.style.display", moreMessageDiv.style.display);
}


// firstLoadMessage
function firstLoadMessage(channelName) {
    let sidebarChannelCount = document.getElementById("sidebar-channel-unread-count-" + channelName);
    sidebarChannelCount.innerText = 0;

    // show unread message count for channels other than channelName

/*
  showUnreadForOtherChannel
*/

    showUnreadForOtherChannel(channelName);

	// load and call getMessage
    console.log("First loading for channel: ", channelName);
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/moremessage",
        data: {
            "channelName": channelName,
            "firstLoad": true
        },
        success: function(messages) {
            console.log("the messages from moremessage api: " + messages);
            if (!messages || messages.length == 0) {
                hideMoremessage(channelName);
            } else {
                storeLastSeenMessageID(channelName, messages);
                insertWords(messages);
            }

/*
  getMessage
*/

            getMessage(channelName);
        }
    });
}


// channels : {"sidebar-channel-Cat": 104}
function storeLastSeenMessageID(channelName, messages) {
    console.log("Store last message id of Channel: " + channelName + " AS "+ messages[0][1]);
    lastSeenMessageID = messages[0][1];

    lastSeenMessageDict[channelName] = lastSeenMessageID;

    // for (var key in channels){
    //   console.log( key, channels[key] );
    // }
}


function getReplyCount(message) {
    threadMessageID = message[1];
    console.log("getReplyCount threadMessageID " + threadMessageID);

    $.ajax({
        async: true,
        type: "POST",
        url: "/api/loadthreadmassage",
        data: {
            "threadMessageID": threadMessageID
        },
        success: function(messages) {
            console.log("getReplyCount " + messages);
            console.log("getReplyCount " + messages.length);
            if (!messages || messages.length == 0) {
                return 0;
            }
            return messages.length;
        }
    });
}


function insertWords(messages) {
    let moreMessageDiv = document.getElementById("chat-page-content-container").firstChild;

    for (var i = 0; i < messages.length; i++) {
        let template = messageTemplate(messages[i]);
        moreMessageDiv.parentNode.insertBefore(template, moreMessageDiv.nextSibling.nextSibling);

        // let getTemplate = new Promise((resolve, reject) => {
        //     let template = messageTemplate(messages[i]);
        //     window.setTimeout(
        //         function() {
        //             resolve(template);
        //     }, 1000);
        // })
        // getTemplate.then((template) => {
        //     moreMessageDiv.parentNode.insertBefore(template, moreMessageDiv.nextSibling.nextSibling);
        // });
    }
}


function messageTemplate(message) {
    let div = document.createElement("div");
    div.setAttribute("class", "chat-page-content");

    let img = document.createElement("img");
    img.setAttribute("src", "http://localhost:5000/static/images/avatar-01.jpg");
    img.setAttribute("id", "Avatar");
    div.appendChild(img);

    let messageid = document.createElement("div");
    messageid.setAttribute("id", "msg-id");
    messageid. setAttribute("hidden", true);
    messageid.innerText = message[1];
    div.appendChild(messageid);

    // handle the img inside text
    let url = getImageURLs(message[3]);
    if (url) {
        var chatPageImg = document.createElement("img");
        chatPageImg.setAttribute("src", url);
        chatPageImg.setAttribute("id", "chat-page-img");
        let p = document.createElement("p");
        var msg = message[3].replace(url, "");
        p.innerText = message[0] + ": " + msg;
        div.appendChild(p);
        div.append(chatPageImg);
    } else {
        let p = document.createElement("p");
        p.innerText = message[0] + ": " + message[3];
        div.appendChild(p);
    }


    // let a = document.createElement("a");
    // a.innerText = replyCount;
    // div.appendChild(a);

    let span = document.createElement("span");
    span.innerText = message[2];
    div.appendChild(span);

    div.onclick = function() {
        isLoad = loadThreadMessage(message);
        showThreadPage(message);
    }

    // let getCount = new Promise((resolve, reject) => {
    //     let replyCount = getReplyCount(message);
    //     console.log("insertWords: " + replyCount);
    //     window.setTimeout(
    //         function() {
    //             resolve(replyCount);
    //         }, 1000);
    // })

    return div;
}

// Image
function getImageURLs(message) {
    const regex = /https\:\/\/[a-zA-Z0-9.\-/]*\/[a-zA-Z_.\-]*.(jpeg|jpg|gif|png)+/g;
    let array = [...message.matchAll(regex)];
    // let res = [];
    // for (var i = 0; i < array.length; i++) {
    //     console.log(array[i][0]);
    // }
    // assume single url
    if (array == null || array[0] == null) {
        return null;
    }
    return array[0][0];
}


function hideMoremessage(channelName) {
    console.log("No more history messages for channel: ", channelName);
    let moreMessageDiv = document.getElementById("chat-page-more-message");
    // let nomoreMessageDiv = document.getElementById("chat-page-no-more-message");
    moreMessageDiv.style.display = "none";
    // nomoreMessageDiv.style.display = "block";
}


function appendWords(messages) {
    if (!messages) {
        return;
    }

    var container = document.getElementById("chat-page-content-container");

    for (var i = 0; i < messages.length; i++) {
        let template = messageTemplate(messages[i]);
        container.append(template);
        console.log(messages[i]);
    }
}

