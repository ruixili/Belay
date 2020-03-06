// side bar channel
function getSidebarChannel(email) {
    console.log("Loading channels");
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/getchannels",
        data: {
            "email": email
        },
        success: function(channels) {
            console.log("the channels from api: " + channels);
            if (!channels) {
                return;
            } else {
                insertChannels(channels);
                return;
            }
        }
    });
}

function insertChannels(channels) {
    let sidebarCreate = document.getElementById("sidebar-create-btn");

    for (var i = 0; i < channels.length; i++) {
        let template = channelTemplate(channels[i]);
        sidebarCreate.parentNode.insertBefore(template, sidebarCreate);
    }
}

function channelTemplate(channel) {
    let template = document.createElement("a");
    template.setAttribute("id", "sidebar-channel-" + channel[0]);
    template.innerText = channel[0];

    return template
}

// firstLoadMessage
function firstLoadMessage(channelName) {
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
            console.log("the messages from api" + messages);
            if (!messages || messages.length == 0) {
                removeMoremessage();
                return;
            } else {
                insertWords(messages);
            }
            getMessage(channelName);
        }
    });
}

function removeMoremessage(channelName) {
    console.log("No more history messages for channel: ", channelName);
    let moreMessageBtn = document.getElementById("chat-page-more-message-btn");
    moreMessageBtn.innerText = "Reach the end of the world!";
}

function insertWords(messages) {
    let moreMessageDiv = document.getElementById("chat-page-content-container").firstChild;

    for (var i = 0; i < messages.length; i++) {
        console.log(messages[i]);
        let template = messageTemplate(messages[i]);
        moreMessageDiv.parentNode.insertBefore(template, moreMessageDiv.nextSibling.nextSibling);
    }
}

// getMessage
function getMessage(channelName) {
    console.log("Getting new messages for channel: ", channelName);
    let messageIDs = document.querySelectorAll("#msg-id");
    let lastMessageDiv = messageIDs[messageIDs.length - 1];

    if (lastMessageDiv) {
        lastMessageID = lastMessageDiv.innerText;
    } else {
        return;
    }
    
    console.log(messageIDs, lastMessageID);
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/getmessage",
        data: {
            "channelName": channelName,
            "lastMessageID": lastMessageID
        },
        success: function(messages) {
            console.log(messages)
            appendWords(messages);
            window.setInterval(getMessage(channelName), 1000);
        }
    });
}

function appendWords(messages) {
    var container = document.getElementById("chat-page-content-container");

    for (var i = 0; i < messages.length; i++) {
        let template = messageTemplate(messages[i]);
        container.append(template);
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

