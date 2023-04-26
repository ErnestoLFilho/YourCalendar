// Src: https://www.w3schools.com/js/js_cookies.asp

function lsw_setCookie(cookie_name, cookie_value) {
    document.cookie = cookie_name + "=" + cookie_value + ";path=/";
}

function lsw_setCookieExpires(cookie_name, cookie_value, expire_days) {
    let d = new Date();
    d.setTime(d.getTime() + (expire_days*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cookie_name + "=" + cookie_value + ";" + expires + ";path=/";
}

function lsw_getCookie(cookie_name) {
  let name = cookie_name + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}