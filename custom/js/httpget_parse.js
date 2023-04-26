// Based on https://stackoverflow.com/questions/45758837/script5009-urlsearchparams-is-undefined-in-ie-11

function lsw_GetHTTP(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null){
        return null;
    }
    else {
        return decodeURI(results[1]) || 0;
    }
}