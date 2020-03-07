// side bar channel
function createChannel(channelName) {
    console.log("Creating New Channel: " + channelName);
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/createchannel",
        data: {
            "channelName": channelName
        },
        success: function(status) {
            console.log("Re-get channels after new channel: " + channelName);
            getSidebarChannel();
        }
    });

}


function getSidebarChannel() {
    console.log("Loading channels");
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/getchannels",
        success: function(channels) {
            console.log("the channels from api: " + channels);
            if (!channels) {
                return;
            } else {
                clearAndInsertChannels(channels);
                return;
            }
        }
    });
}

function clearAndInsertChannels(channels) {
    let sidebarCreate = document.getElementById("sidebar-create-btn");

    while (sidebarCreate.previousSibling) {
        sidebarCreate.parentNode.removeChild(sidebarCreate.previousSibling);
    }

    for (var i = 0; i < channels.length; i++) {
        let template = channelTemplate(channels[i]);
        sidebarCreate.parentNode.insertBefore(template, sidebarCreate);
    }
}

function channelTemplate(channel) {
    let container = document.createElement("div");
    container.setAttribute("class", "sidebar-channel-container");

    let template = document.createElement("a");
    template.setAttribute("class", "sidebar-channel");
    template.setAttribute("id", "sidebar-channel-" + channel[0]);
    template.onclick = function() {
        document.getElementById("chat-page-title-name").innerText = channel[0];
        emptyChatArea();
        firstLoadMessage(channel[0]);
    }
    template.innerText = channel[0];
    container.appendChild(template);

    let p = document.createElement("p");
    p.setAttribute("id", "sidebar-channel-unread-count-" + channel[0]);
    p.setAttribute("class", "sidebar-channel-unread-count");
    p.innerText = 0;
    container.appendChild(p);

    return container
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
    // show unread message count for channels other than channelName
    console.log("------------------------------------------------------", channelName);
    showUnreadForOtherChannel(channelName);
    console.log("------------------------------------------------------", channelName);

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
            getMessage(channelName);
        }
    });
}

// getMessage for current channel
var curChannelGetMessage;

function getMessage(channelName) {
  clearInterval(curChannelGetMessage);
  curChannelGetMessage = setInterval(function() {
    console.log("Getting new messages for channel: ", channelName);
    let messageIDs = document.querySelectorAll("#msg-id");
    let lastMessageDiv = messageIDs[messageIDs.length - 1];

    if (lastMessageDiv) {
        lastMessageID = lastMessageDiv.innerText;
    } else {
        lastMessageID = 0;
    }
    
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/getmessage",
        data: {
            "channelName": channelName,
            "lastMessageID": lastMessageID
        },
        success: function(messages) {
            console.log("the messages from getmessage api: " + messages);
            if (messages && messages.length != 0) {
                storeLastSeenMessageID(channelName, messages);
                appendWords(messages);
            }
        }
    });

  }, 1000);
}

// get message count for background channel
var curShowUnreadMessageCount;

function showUnreadForOtherChannel(channelName) {
  clearInterval(curShowUnreadMessageCount);
  curShowUnreadMessageCount = setInterval(function() {
    channels = JSON.parse(window.localStorage.getItem('lastSeenMessage'));
    for (var cn in channels){
        if (cn != channelName) {
            console.log("I am in !-------------------" + cn + " " + channels[cn]);

            // make other channels fetch message count
            console.log("showUnreadMessageCount for Channel: " + cn + " lastMessageID: " + channels[cn]);
            // channelName, lastSeenMessageID
            showUnreadMessageCount(cn, channels[cn]);
        }
    }
  }, 1000);
}

function showUnreadMessageCount(channelName, lastMessageID) {
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/getunreadmessagecount",
        data: {
            "channelName": channelName,
            "lastMessageID": lastMessageID
        },
        success: function(count) {
            console.log("the messages from getunreadmessagecount api: " + count);
            if (count) {
                showUnreadOnSidebar(channelName, count);
            }
        }
    });
}

////////////
function showUnreadOnSidebar(channelName, count) {
    let sidebarChannelCount = document.getElementById("sidebar-channel-unread-count-" + channelName);
    sidebarChannelCount.innerText = count;
}



function hideMoremessage(channelName) {
    console.log("No more history messages for channel: ", channelName);
    let moreMessageDiv = document.getElementById("chat-page-more-message");
    // let nomoreMessageDiv = document.getElementById("chat-page-no-more-message");
    moreMessageDiv.style.display = "none";
    // nomoreMessageDiv.style.display = "block";
}

// {"sidebar-channel-Cat": 104}
localStorage.setItem("lastSeenMessage", "{}");

function storeLastSeenMessageID(channelName, messages) {
    console.log("Store last message id of Channel: " + channelName + " AS "+ messages[0][1]);
    lastSeenMessageID = messages[0][1];

    channels = JSON.parse(window.localStorage.getItem('lastSeenMessage'));
    channels[channelName] = lastSeenMessageID;
    localStorage.setItem("lastSeenMessage", JSON.stringify(channels));

    // for (var key in channels){
    //   console.log( key, channels[key] );
    // }
}

function insertWords(messages) {
    let moreMessageDiv = document.getElementById("chat-page-content-container").firstChild;

    for (var i = 0; i < messages.length; i++) {
        let template = messageTemplate(messages[i]);
        moreMessageDiv.parentNode.insertBefore(template, moreMessageDiv.nextSibling.nextSibling);
    }
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

function messageTemplate(message) {
    let div = document.createElement("div");
    div.setAttribute("class", "chat-page-content");

    let img = document.createElement("img");
    img.setAttribute("src", "http://localhost:5000/static/images/avatar-01.jpg");
    img.setAttribute("alt", "Avatar");
    div.appendChild(img);

    let messageid = document.createElement("div");
    messageid.setAttribute("id", "msg-id");
    messageid. setAttribute("hidden", true);
    messageid.innerText = message[1];
    div.appendChild(messageid);

    let p = document.createElement("p");
    p.innerText = message[0] + ": " + message[3];
    div.appendChild(p);

    let span = document.createElement("span");
    span.innerText = message[2];
    div.appendChild(span);

    return div;
}

