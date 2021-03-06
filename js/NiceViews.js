//
// Nice Views code
//
// @author: Ido Green | @greenido
// Date: Nov 2014
// Update: 10/3/2015 - with new (better) layout for the images
//

function unixTimeToReadable(unix_timestamp) {
  var date = new Date(unix_timestamp * 1000);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  var seconds = date.getSeconds();
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  var year = date.getFullYear();
  var month = date.getMonth() +1;
  var day = date.getDate();
  // will display time in 10:30:23 format
  var formattedTime =  "(" + day + "/" + month + "/" + year + ") " + hours + ':' + minutes + ':' + seconds;
  return formattedTime;
}

//
// All the functions we have in the setting dialog:
// 1. Read setting on load time. 
// 2. Save setting to local Storage
//
function settingTab() {
  // update the setting tab with info from localStorage
  var tUsers = 0;
  if (localStorage.getItem("t-users") > 0) {
    tUsers = localStorage.getItem("t-users");  
  }
  tUsers++;
  var noCustom = true;
  for (var j = 1; j < tUsers; j++) {
    var tUserName = localStorage.getItem("twitter" + j);
    if (tUserName === null || tUserName === undefined) {
      tUserName = "";
    }
    $("#t-users").append('<div class="small-8 columns"><input type="text" placeholder="e.g. greenido" value=' + 
       tUserName + '></div>'); 
    if (tUserName.length > 2) {
      fetchTweetAccount(tUserName); 
      noCustom = false;
    }
  }

  if (noCustom) {
    $("#custom").html('<img src="img/sad-cat-1.jpg" alt="sad sad cat - due to no photos!" /> <h4>'+
      ' <i class="fi-photo size-48 style3"></i></h4> <h5>Checkout the <i>Settings</i> tab to customize this view!</h5>');
  }

  // Add twitter user button
  $("#addbut").click(function() {
    $("#t-users").append('<div class="small-8 columns"><input type="text" placeholder="e.g. greenido" /></div>');
  })

  // Cancel button - just show the first panel 
  $("#cancelset").click(function() {
    $("#panel1").addClass("active");
  });

  // Save action
  $("#saveset").click(function() {
    // save to localStorage
    console.log('-- saving to local storage all the settings --');
    var i=1;
    $("form#setform :input").each(function(){
      var input = $(this); 
      //if (input.val().length > 2) {
        localStorage.setItem("twitter" + i, input.val());
      // }
      // else {
      //   localStorage.removeItem("twitter" + i);
      // }
      i++;
    });
    // So will keep track on how many users we are fetching
    localStorage.setItem("t-users", (i-1));
    $("#panel2").addClass("active");
    location.reload();
  });
}

//
// Start the party
//
$(function() {
  console.log("-- Starting the party --");
  settingTab();

  $('#reload').click(function() {
      location.reload();
  }); 

});