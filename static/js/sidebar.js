/*
 * Sidebar 
 */
 

$("#sidebar-channel").click(function() {
	channelName = $("#sidebar-channel").innerText;
	console.log(channelName);
	firstLoadMessage(channelName);
});

$("#sidebar-create-btn").click(function() {
    document.getElementById("sidebar-create-channel").style.display = "block";
    document.getElementById("sidebar-create-btn").style.display = "none";
});

$("#sidebar-create-channel-close-btn").click(function() {
    document.getElementById("sidebar-create-btn").style.display = "block";
    document.getElementById("sidebar-create-channel").style.display = "none";
});

$("#sidebar-create-channel-btn").click(function() {
    let channelName = document.getElementById("sidebar-create-channel-name").value;
    console.log(channelName);
    if (!channelName) {
        alert("Channel name can't be empty!");
        return;
    }
    createChannel(channelName);
    document.getElementById("sidebar-create-btn").style.display = "block";
    document.getElementById("sidebar-create-channel").style.display = "none";
});

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
        // put channel into lastSeenMessageDict
        lastSeenMessageDict[channels[i][0]] = 0;
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
    for (var cn in lastSeenMessageDict){
        if (cn != channelName) {
            console.log("I am in !-------------------" + cn + " " + lastSeenMessageDict[cn]);

            // make other channels fetch message count
            console.log("showUnreadMessageCount for Channel: " + cn + " lastMessageID: " + lastSeenMessageDict[cn]);
            // channelName, lastSeenMessageID
            showUnreadMessageCount(cn, lastSeenMessageDict[cn]);
        }
    }
  }, 1000);
}

var lastSeenMessageDict = {};
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


function showUnreadOnSidebar(channelName, count) {
    let sidebarChannelCount = document.getElementById("sidebar-channel-unread-count-" + channelName);
    sidebarChannelCount.innerText = count;
}
