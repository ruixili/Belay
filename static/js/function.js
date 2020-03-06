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
            if (!messages) {

                removeMoremessage();
                return;
            } else {
                insertWords(messages);
            }
            // getMessage(channelName);
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

    // for (var i = 0; i < messages.length; i++) {
        let template = wordTemplate("hahaha");
        moreMessageDiv.parentNode.insertBefore(template, moreMessageDiv.nextSibling.nextSibling);
    // }
}

function getMessage(channelName) {
    let messageIDs = document.querySelectorAll("#msg-id");
    let lastMessageDiv = messageIDs[messageIDs.length - 1];

    if (lastMessageDiv) {
        lastMessageID = lastMessageDiv.innerText;
    } else {
        lastMessageID = null;
    }
    
    $.ajax({
        async: true,
        type: "POST",
        url: "/getmessage",
        data: {
            channelName: channelName,
            last_message_id: last_message_id
        },
        success: function(messages) {
            appendWords(messages);
            window.setInterval(getMessage(channelName), 1000);
        }
    });
}

function appendWords(messages) {
    var container = document.getElementById("chat-page-content-container");

    for (var i = 0; i < messages.length; i++) {
        let template = wordTemplate(messages[i]);
        container.append(template);
    }
}

/*
	<div class="chat-page-content" name=1>
	  <div id="msg-id">1</div>
	  <img src="http://localhost:5000/static/images/avatar-01.jpg" alt="Avatar">
	  <p>Hello. How are you today?Hello. How are you today?Hello. How are you today?Hello. How are you today?Hello. How are you today?</p>
	  <span>11:00</span>
	</div>
*/
function wordTemplate(message) {
    let div = document.createElement("div");
    div.setAttribute("class", "chat-page-content");

    let img = document.createElement("img");
    img.setAttribute("src", "http://localhost:5000/static/images/avatar-01.jpg");
    img.setAttribute("alt", "Avatar");
    div.appendChild(img);

    let messageid = document.createElement("div");
    messageid.setAttribute("id", "msg-id");
    messageid. setAttribute("hidden", true);
    messageid.innerText = 1;
    div.appendChild(messageid);

    let p = document.createElement("p");
    p.innerText = "Hello. How are you today?";
    div.appendChild(p);

    let span = document.createElement("span");
    span.innerText = "11:00";
    div.appendChild(span);

    return div;
}

