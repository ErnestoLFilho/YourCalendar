// Based on YouTube's own API

var __lsw_YT_data = [
    /*0*/ null, // player
    /*1*/ "youtube_player", // player ID
    /*2*/ "youtube_vol", // player cookie
    /*3*/ "jfKfPfyJRdk", // player URL
    /*4*/ false, // was playing?
    /*5*/ false, // played once?
    /*6*/ true, // play on load?
    /*7*/ "Playing", // playing html/text
    /*8*/ "Paused", // paused html/text
    /*9*/ "youtube_control" // player link ID (text)
];

// === Functional stuff === //

// copied from cookie manager so we don't need to include that
function __getCookie(cookie_name) {let name = cookie_name + "="; let decodedCookie = decodeURIComponent(document.cookie); let ca = decodedCookie.split(';'); for(let i = 0; i <ca.length; i++) { let c = ca[i]; while (c.charAt(0) == ' ') { c = c.substring(1); } if (c.indexOf(name) == 0) { return c.substring(name.length, c.length); } } return ""; }
// copied from httpget_parse so we don't need to include that
function __getHTTP(tag) {const results = new RegExp('[\?&]' + tag + '=([^&#]*)').exec(window.location.href);if(results == null){return null;}else{return decodeURI(results[1]) || 0;}}

function __onPlayerStateChange(event) {}
function __onPlayerReady(event) {
    if (__lsw_YT_data[6]) { 
        console.log("Trying to play video"); 
        event.target.playVideo();
        __lsw_YT_data[4] = true;
        if (__lsw_YT_data[9]) {
            let elpl = document.getElementById(__lsw_YT_data[9]);
            if (elpl) elpl.innerHTML = __lsw_YT_data[7];
        }
    }

    let new_volume = __getHTTP("vid_vol");
    if (new_volume == null || new_volume == "") { // no &vid_vol=X    
        new_volume = __getCookie(__lsw_YT_data[2]);
        if (new_volume !== null && new_volume !== "") { __lsw_YT_data[0].setVolume(new_volume); /*perc*/ }
        else { __lsw_YT_data[0].setVolume(10); /*perc*/ }
    }
    else  __lsw_YT_data[0].setVolume(new_volume); 
    
    let el = document.getElementById(__lsw_YT_data[1]);
    if (!el) return;

    el.style.visibility="hidden";
    el.style.position="fixed";
}
function __doYouTubePlay() {
    let el = document.createElement('script');
    el.src = "https://www.youtube.com/iframe_api";
    let se = document.getElementsByTagName('script')[0];
    se.parentNode.insertBefore(el, se);
}
function onYouTubeIframeAPIReady() {
    console.log("Iframe loaded");

    const possible_urlid = __getHTTP("vid_id");

    __lsw_YT_data[0] = new YT.Player(__lsw_YT_data[1], {
        height: '0',
        width: '0',
        videoId: (possible_urlid != null && possible_urlid != "") ? possible_urlid : __lsw_YT_data[3],
        playerVars: {
            'playsinline': 1
        },
        events: {
            'onReady': __onPlayerReady,
            'onStateChange': __onPlayerStateChange
        }
    });
    
    let el = document.getElementById(__lsw_YT_data[1]);
    if (!el) return;

    el.style.visibility="hidden";
    el.style.position="fixed";
}

// === Things used by you/user === //

// play a YouTube ID video
function lsw_YTPlay(url, skip_change_text) {
    if (url) __lsw_YT_data[3] = url;

    if (__lsw_YT_data[0]) {
        if (url) __lsw_YT_data[0].loadVideoById(url);
        __lsw_YT_data[0].playVideo();
        __lsw_YT_data[4] = true;
    }
    else { // new youtube thing
        setTimeout(function () {__doYouTubePlay();}, "1000");
    }

    if (__lsw_YT_data[9] && !skip_change_text) {
        let elpl = document.getElementById(__lsw_YT_data[9]);
        if (elpl) elpl.innerHTML = __lsw_YT_data[7];
    }
}

// Stop video
function lsw_YTStop() {
    __lsw_YT_data[0].stopVideo();
    __lsw_YT_data[4] = false;

    if (__lsw_YT_data[9]) {
            let elpl = document.getElementById(__lsw_YT_data[9]);
            if (elpl) elpl.innerHTML = __lsw_YT_data[8];
        }
}

// Toggle video play/pause
function lsw_YTPlayPauseToggle() 
{
    if (__lsw_YT_data[4]) lsw_YTStop();
    else lsw_YTPlay();
}

// full setup
function lsw_YTSetup(id, button_id, play_on_load, cookie, url, on_play_html, on_pause_html) {
    if (id) __lsw_YT_data[1] = id;
    if (cookie) __lsw_YT_data[2] = cookie;
    __lsw_YT_data[6] = play_on_load === true ? true : false;

    lsw_YTSetTitles(button_id, on_play_html, on_pause_html);
    lsw_YTPlay(url, true);
}

// Change titles
function lsw_YTSetTitles(id, on_play, on_pause)
{
    if (id) __lsw_YT_data[9] = id;
    if (on_play) __lsw_YT_data[7] = on_play;
    if (on_pause) __lsw_YT_data[8] = on_pause;
}

// is YouTube player ready to play aka created?
function lsw_YTIsReady()
{
    if (__lsw_YT_data[0]) return true;
    return false;
}

// show volume prompt
function lsw_YTPromptVol()
{
    if (__lsw_YT_data[0] == null) {
        alert("Player is not running yet.");
        return;
    }
    let new_volume = prompt("New volume? [0 to 100, percent]", __lsw_YT_data[0].getVolume());
    if (new_volume === null || new_volume < 0 || new_volume > 100) {
        return;
    }
    __lsw_YT_data[0].setVolume(new_volume);
    document.cookie = __lsw_YT_data[2] + "=" + new_volume + ";path=/";
}
