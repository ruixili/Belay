$("#sidebar-channel").click(function() {
	channelName = $("#sidebar-channel").innerText;
	console.log(channelName);
	firstLoadMessage(channelName);
});