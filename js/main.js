//
// Main code of our app.
// 1. Simple fetching of images from Instagram API
//
// @author: Ido Green | @greenido
// Date: Nov 2014
//

$(document).foundation();


//
// Fetch the popular images from insta
//
function fetchFeed(curFeed, curSource) {
    $('#mainlist').append("<div id='spinner'><img src='img/ajax-loader.gif' /></div>");
    $.ajax({
    url : document.location.protocol + curFeed,
    dataType : 'json',
    error: function(err) {
      console.error("Could not fetch feed: " + curFeed + " Err: " + JSON.stringify(err));
    },
    success  : function (data) {
      // Check if we got something to work on.
      if (data && data.data ) {    
        $("#spinner").remove();    
        var curIndex = 1;
        var mainList = '';
        $.each(data.data, function (i, entry) {
          var when = entry.created_time;
          when += " (" + curSource + ")";
          // console.log("-----------" + when + "-------------");
          var buttonHTML = "";
          if (entry.caption && entry.caption.text) {
            var picText = entry.caption.text;
            if (picText.length > 300) {
              picText = picText.substring(0,300) + "...";
            }
          }
           
          //var geoMap = "";
          // If we have geo location - let's have a nice little map ;)
          // if ( entry.location &&  entry.location.latitude &&  entry.location.longitude ) {
          //   geoMap = //'<div class="large-6 large-centered columns">' + 
          //             '<img border="0" src="https://maps.googleapis.com/maps/api/staticmap?center=' +
          //             entry.location.latitude + ',' + entry.location.longitude +
          //             '&amp;zoom=8&amp;size=200x200" class="quimby_search_image">' ;
          //             //'</div>';
          // }  
          // Add the image to our page
          mainList += '<div class="large-6 large-centered columns">' +   
                        '<img src="' + entry.images.standard_resolution.url + '" height="640" width="640"/> ' +
                        '</div>' + 
                        '<div class="large-3 large-centered columns">' + 
                        '<a href="' + entry.link + '" target="_blank" class="button">' + 
                        picText + '<br></a> </div>';
          curIndex++;
        });

        $('#mainlist').html("");
        $('#mainlist').append(mainList);
      }
    }
  });
}

//
// We could use something like that, when the images are on our server:
// var image = new Image();
// image.addEventListener("load", function(e) {
//   var imgData = getBase64Image(image);
//   localStorage.setItem("t_img" + i, imgData);
// });
// image.src = entry.entities.media[0].media_url;  
//
function getBase64Image(img) {
  // Create an empty canvas element
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  // Copy the image contents to the canvas
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  // Get the data-URL formatted image
  // original format, but be aware the using "image/jpg" will re-encode the image.
  var dataURL = canvas.toDataURL("image/png");
  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

//
// Fetch tweets - hopefully with cool images
//
function fetchTweets() {
 $.ajax({
    url : "tweet-pics.php",
    dataType : 'json',
    error: function(err) {
      console.error("Could not fetch tweets. Err: " + JSON.stringify(err));
    },
    success  : function (data) {
      // Check if we got something to work on.
      if (data) {
        var mainList = '';
        $.each(data, function (i, entry) {
          if (entry.entities && entry.entities.media) {
            var when = entry.created_at;
         
            //console.log("-----------" + when + "-------------");
            //console.log("title      : " + entry.text);
            when = when.substring(0,10);
            var imgTitle = entry.text.substring(0, entry.text.indexOf("http://t"));
            mainList += '<div class="large-6 large-centered columns">' + 
              '<img src="' + entry.entities.media[0].media_url + '" height="640" width="640"/> ' +
              '</div>' + 
              '<div class="large-3 large-centered columns">' + 
              '<a href="' + entry.entities.media[0].expanded_url +
              '" target="_blank" class="button">'+ imgTitle + '<br>(' + when + ')</a>' + 
              ' </div>';

          } 
        });
        clearTimeout(timer);
        //$('#models').html("");
        $('#models').html(mainList);
      
      }
    }
  });
}

//
// Fetch tweets per account
//
function fetchTweetAccount(tUserName) {
 $.ajax({
    url : "tweetsPerAccount.php?user=" + tUserName,
    dataType : 'json',
    error: function(err) {
      console.error("Could not fetch tweets. Err: " + JSON.stringify(err));
    },
    success  : function (data) {
      // Check if we got something to work on.
      if (data) {
        var mainList = '';
        $.each(data, function (i, entry) {
          if (entry.entities && entry.entities.media) {
            var when = entry.created_at;
         
            //console.log("-----------" + when + "-------------");
            //console.log("title      : " + entry.text);
            when = when.substring(0,10);
            var imgTitle = entry.text.substring(0, entry.text.indexOf("http://t"));
            mainList += '<div class="large-6 large-centered columns">' + 
              '<img src="' + entry.entities.media[0].media_url + '" alt="Views App: ' + imgTitle + '"/>' + 
              '</div>' + 
              '<div class="large-3 large-centered columns">' + 
              '<a href="' + entry.entities.media[0].expanded_url +
              '" target="_blank" class="button">'+ imgTitle + '<br>(' + when + ')</a>' + 
              ' </div>';

          } 
        });
        $('#custom').append(mainList);
      
      }
    }
  });
}

//
function picAround() {
  if (navigator.geolocation) {
        navigator.geolocation.watchPosition(fetchPosition);
  } else {
     console.warn("Cannot get the Geo location :(" );
  }
}

//
function fetchPosition(position) {
    console.log("Latitude: " + position.coords.latitude + " Longitude: " + position.coords.longitude); 
    var geoImgFeed = "proxy.php?url=https://api.instagram.com/v1/media/search?client_id=218ce81fd3aa49188e4b643556a79559" +
            "lat=" + position.coords.latitude  + 
            "long=" + position.coords.longitude+
            "&callback=success";
  

  fetchFeed(geoImgFeed, "Around");
}

function displayMsgWhileWaiting(idElem) {
    var secs = 10;
    var msgArray = ["No great artist ever sees things as they really are. If he did, he would cease to be an artist.",
        "True friends stab you in the front.",
        "I have the simplest tastes. I am always satisfied with the best.",
        "Some cause happiness wherever they go; others whenever they go",
        "Children begin by loving their parents; after a time they judge them; rarely, if ever, do they forgive them.",
        "The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart.",
        "Try to be a rainbow in someone's cloud.",
        "Put your heart, mind, and soul into even your smallest acts. This is the secret of success."
    ];
    var randInx = Math.floor(Math.random() * msgArray.length);
    $(idElem).html('<p> <center> <img src="img/ajax-loader.gif" /> </center> </p> <h4>' + msgArray[randInx] +'</h4>');
    timer = setInterval(function () {
        if (secs < 1) {
            clearTimeout(timer);
            return;
        }
        secs--;
        var randInx = Math.floor(Math.random() * msgArray.length);
        $(idElem).html('<p> <center> <img src="img/ajax-loader.gif" /> </center> </p> <h4>' + msgArray[randInx] +'</h4>');
        
    }, 2500);
}
//
//
//
function fetchAllFeeds() {
  var top = "proxy.php?url=https://api.instagram.com/v1/media/popular?client_id=218ce81fd3aa49188e4b643556a79559&callback=success";
  fetchFeed(top, "Top");

  displayMsgWhileWaiting('#models');
  fetchTweets();
}

// First fetch of all the feeds to the page
fetchAllFeeds();

// fetch new data every 60sec
setInterval(fetchAllFeeds, 60000);

