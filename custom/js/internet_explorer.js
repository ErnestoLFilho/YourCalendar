// https://stackoverflow.com/questions/19999388/check-if-user-is-using-ie
// Works IE. Checked: 20230327

function detectIEEdge() {
    let ua = window.navigator.userAgent;
  
    let msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }
  
    let trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        let rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }
  
    let edge = ua.indexOf('Edge/');
    if (edge > 0) {
       // Edge => return version number
       return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }
  
    // other browser
    return false;
  }