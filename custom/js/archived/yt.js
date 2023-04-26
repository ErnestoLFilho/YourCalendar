// Based on YouTube's own API

var tag;
var firstScriptTag;
var player;
var playerID = "player";
var wasPlaying = false;
var playedOnce = false;

function onYouTubeIframeAPIReady() {
    console.log("Iframe loaded");
    player = new YT.Player(playerID, {
        height: '0',
        width: '0',
        videoId: 'jfKfPfyJRdk',
        playerVars: {
            'playsinline': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
    document.getElementById(playerID).style.visibility="hidden";
    document.getElementById(playerID).style.position="fixed";
}

function onPlayerStateChange(event) {}

function stopVideo() {
    console.log("Stop video called");
    player.stopVideo();
}

function restartVideo() {
    console.log("Start video called");
    player.playVideo();
}
function onPlayerReady(event) {
    console.log("Trying to play video");
    event.target.playVideo();

    {
        let new_volume = lsw_getCookie("lsw_yt_vol");
        if (new_volume !== null && new_volume !== "") {
            player.setVolume(new_volume); // percent
        }
        else {
            player.setVolume(10); // percent
        }
    }
    
    document.getElementById(playerID).style.visibility="hidden";
    document.getElementById(playerID).style.position="fixed";
}

function _youtube_play()
{
    tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function lsw_AutoPlayYT(id, tochange, str_on, str_off) {
    playerID = id;
    
    if (!wasPlaying) {
        document.getElementById(tochange).innerHTML=str_off;
        console.log("Player set to run with " + playerID + " as tag");
        if (!playedOnce) {
            console.log("New player installed");
            setTimeout(function () {_youtube_play();}, "2000");
        }
        else {
            console.log("Resuming player");
            restartVideo();
        }
        playedOnce = true;
    }
    else {
        document.getElementById(tochange).innerHTML=str_on;
        stopVideo();
    }
    wasPlaying = !wasPlaying;
    
}

function lsw_PromptYTVolume()
{
    if (player == null) {
        alert("Player is not running yet.");
        return;
    }
    let new_volume = prompt("New volume? [0 to 100, percent]", player.getVolume());
    if (new_volume === null || new_volume < 0 || new_volume > 100) {
        alert("Invalid volume!");
        return;
    }

    player.setVolume(new_volume);

    lsw_setCookie("lsw_yt_vol", new_volume);

    alert("Saved!");
}