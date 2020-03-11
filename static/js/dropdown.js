/*
 * dropdown 
 */

var changeUsername = document.getElementById("dropdown-changeUsername");
var changeEmail = document.getElementById("dropdown-changeEmail");


function dropdown() {
  document.getElementById("myDropdown").classList.toggle("show");
}


window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}


$("#dropdown-content-change-username").click(function() {
  changeUsername.style.display = "block";
  channelPage.style.display = "none";
});


$("#dropdown-content-change-email").click(function() {
  changeEmail.style.display = "block";
  channelPage.style.display = "none";
});
