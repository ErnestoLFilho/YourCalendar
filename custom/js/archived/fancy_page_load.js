// source: https://stackoverflow.com/questions/18045551/how-do-i-download-a-file-from-external-url-to-variable

var xhr;

function load(url, callback) {
  xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) callback(xhr.responseText);
  };
  xhr.open("GET", url, true);
  xhr.send();
}

function lsw_ReplaceContentWithPage(divid, pageurl, on_success = null)
{
    load(pageurl, function (contents) {    
        document.getElementById(divid).innerHTML=contents;
        if (typeof on_success === 'function') on_success();
    });
}

function lsw_RemoveItem(item_id)
{
  if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
  }
  let element = document.getElementById(item_id);
  if (element) element.remove();
}
