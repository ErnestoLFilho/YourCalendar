// Adapted from https://stackoverflow.com/questions/17966219/using-javascript-to-set-cookie-in-ie

// cookie.js file
//var cookieToday = new Date(); 
//var expiryDate = new Date(cookieToday.getTime() + (365 * 86400000)); // a year

/* Cookie functions originally by Bill Dortsch */

function setCookie (name,value,expires,path,theDomain,secure) { 
   //value = escape(value);
   var theCookie = name + "=" + value + 
   ((expires)    ? "; expires=" + expires.toGMTString() : "") + 
   ((path)       ? "; path="    + path                  : "") + 
   ((theDomain)  ? "; domain="  + theDomain             : "") + 
   ((secure)     ? "; secure"                           : ""); 
   document.cookie = theCookie;
} 

function getCookie(Name) { 
   let search = Name + "=";
   if (document.cookie.length > 0) { // if there are any cookies 
      let offset = document.cookie.indexOf(search);
      if (offset != -1) { // if cookie exists 
         offset += search.length;
         // set index of beginning of value 
         let end = document.cookie.indexOf(";", offset) ;
         // set index of end of cookie value 
         if (end == -1) end = document.cookie.length;
         return document.cookie.substring(offset, end);//unescape(document.cookie.substring(offset, end)) 
      } 
   } 
} 
function delCookie(name,path,domain) {
   if (getCookie(name)) document.cookie = name + "=" +
      ((path)   ? ";path="   + path   : "") +
      ((domain) ? ";domain=" + domain : "") +
      ";expires=Thu, 01-Jan-70 00:00:01 GMT";
}