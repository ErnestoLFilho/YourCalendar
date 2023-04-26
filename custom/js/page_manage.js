// source: https://stackoverflow.com/questions/18045551/how-do-i-download-a-file-from-external-url-to-variable
// Works IE. Checked: 20230327

var xhr;

function load(url, callback) {
  xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        callback(xhr.responseText);
    }
  };
  xhr.open("GET", url, true);
  xhr.send();
}

function lsw_ReplaceContentWithPage(div_id, page_url, on_success)
{
    load(page_url, function (contents) {    
        document.getElementById(div_id).innerHTML=contents;
        if (on_success) on_success();
    });
}

function lsw_replaceImg(img_id, what_path, title, alt) // "custom/images/pfp_alt_funny.jpg"
{
  let el = document.getElementById('pfp_footer_0');

  if (what_path) el.src=what_path;
  if (title) el.title=title;
  if (alt) el.alt=alt;
}

function lsw_funnyIMGloop(is_alt_now)
{
  lsw_replaceImg(
    "pfp_footer_0",
    is_alt_now ? "custom/images/pfp_alt_funny.jpg" : "custom/images/pfp.jpg", 
    is_alt_now ? "OWO" : "Just a profile picture lmao");

  setTimeout(function() {lsw_funnyIMGloop(is_alt_now ? false : true);}, is_alt_now ? 500 : ((Math.random() * 9.0 + 1.0) * 7500));
}

function lsw_autohrefSwitch(thus) // workin on. onmouseover="lsw_autohrefSwitch(this)"?
{
  alert(thus); // thus == like http://goto/itservices
  var els = document.getElementsByTagName("a[href='" + thus + "']");
  if (els == null || els.length == 0) return;
  els[0].innerHTML = "WORKS";
}