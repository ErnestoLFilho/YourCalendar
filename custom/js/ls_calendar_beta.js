// Localstorage Calendar feature

var __buildTable_last = "";

function __getDateStr() {
  const dat = new Date();
  return dat.getFullYear() + "/" + (dat.getMonth() + 1) + "/" + dat.getDate();
}

function __getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function __getTimeStr() {
  return "" + Math.floor((new Date()).getTime() / 1000);
}

// IE11 doesn't support startsWith
function __startsWith(str, word) {
  return str.lastIndexOf(word, 0) === 0;
}

function __getCurrentWeekDays() {
  var current = new Date();
  var week= new Array(); 
  // Starting Monday not Sunday
  current.setDate((current.getDate() - current.getDay() +1));
  for (var i = 0; i < 7; i++) {
      week.push(
          new Date(current)
      ); 
      current.setDate(current.getDate() +1);
  }
  return week; 
}

function __sliceString(string, character, limit_results) {
  let counter = 0;
  let limit_results_parsed = limit_results == null ? 1000 : limit_results;
  let pos = 0;
  let finals = [];
  
  while(1) {
    let found = string.indexOf(character, pos);
    if (found == -1) {
      if (pos < string.length) {
        finals[counter] = string.substring(pos);
        counter++;
      }
      break;
    }
    else {
      let test = string.substring(pos, found);
      if (test != null && test.length > 0){
        finals[counter] = test;
        counter++;
      }
      pos = found + 1;
    }
    if (counter >= limit_results_parsed) break;
  }
  return finals;
}

function __timeToStr(tempo) {
  if (tempo < 0) return "unknown";
  
  const work_seconds = tempo % 60;
  const work_minutes = (Math.floor(tempo / 60)) % 60;
  const work_hours = (Math.floor(tempo / (60 * 60)));

  return (("" + work_hours + "h" +
      (work_minutes >= 10 ? ("" + work_minutes) : ("0" + work_minutes)) + "m" +
      (work_seconds >= 10 ? ("" + work_seconds) : ("0" + work_seconds)) + "s"));
}

function __dateToStr(the_date_utc_sec) {
  const date_real = new Date(the_date_utc_sec * 1000);
  
  return (("" + date_real.getHours() + "h") +
      (date_real.getMinutes() >= 10 ? ("" + date_real.getMinutes()) : ("0" + date_real.getMinutes())) + "m" +
      (date_real.getSeconds() >= 10 ? ("" + date_real.getSeconds()) : ("0" + date_real.getSeconds())) + "s");
}

// format of date: "2023/04/11"; Returns: start, end, break time
function __getLSDateInfo(date)
{  
  const thus_val = localStorage.getItem("lsw_d-" + date);
  if (thus_val == null) return null;
    
  // ============ almost copy from build table 
  let thus_val_list = __sliceString(thus_val, ',');
  if (thus_val_list.length % 2 != 0) {
      thus_val_list[thus_val_list.length] = "0";
  }

  let interval_total = 0;
  for(let ii = 1; ii < thus_val_list.length - 1;) {
    interval_total += (Number(thus_val_list[ii+1]) - Number(thus_val_list[ii]));
    ii += 2;
  }

  let i = [
    thus_val_list[0],
    (thus_val_list[thus_val_list.length - 1]),
    interval_total
  ];
  // ============ end of almost copy from build table

  return i;
}



function lsw_CalendarJoin(notif) {
  const datnow = "lsw_d-" + __getDateStr();
  let nw = localStorage.getItem(datnow);

  if (nw != null) {
    if (notif == false) return;
    if (confirm("You have started today already. Do you want to reset this day? Click OK to reset, Cancel to do nothing.")) {
      localStorage.setItem(datnow, __getTimeStr());
    }
  }
  else {
    localStorage.setItem(datnow, __getTimeStr());
  }
}

function lsw_CalendarLeft(notif) {
  const datnow = "lsw_d-" + __getDateStr();
  let nw = localStorage.getItem(datnow);

  if (nw == null || nw == "") {
    alert("Today has not started yet(?), cannot leave what hasn't started");
    return;
  }
  
  let thus_val_list = __sliceString(nw, ',');
  if (thus_val_list.length == 0) {
    alert("Something went wrong!");
    return;
  }
  else if (thus_val_list.length % 2 == 0) {
    if (notif == false || confirm("You have already set the left time, manually or automatically. Do you want to update it? OK will replace the value, Cancel does nothing.")) {
      thus_val_list[thus_val_list.length - 1] = __getTimeStr();
      localStorage.setItem(datnow, thus_val_list.join(',')); 
    }
  }
  else {
    localStorage.setItem(datnow, nw + "," +  __getTimeStr()); 
  }
}

function lsw_TakeABreak()
{
  let before = new Date();
  let save_it = confirm("Click OK to end break time. Click Cancel to discard this break time.");

  if (!save_it) {
    if (confirm("Are you SURE you want to discard your break time? If you click OK, break time is discarded. If you click CANCEL, break time will be SAVED.")) {
      alert("You have cancelled your break time. Break time not saved.");
      return;
    }
  }
  
  let after = new Date();
  let time_in_break_sec = Math.floor(Number(after - before) / 1000);

  const datnow = "lsw_d-" + __getDateStr();
  let nw = localStorage.getItem(datnow);
  
  let thus_val_list = __sliceString(nw, ',');

  if (thus_val_list.length % 2 == 1) {
    thus_val_list[thus_val_list.length] = "" + Math.floor(Number(before) / 1000);
    thus_val_list[thus_val_list.length] = "" + Math.floor(Number(after) / 1000);
  }
  else {
    thus_val_list[thus_val_list.length - 1] = "" + Math.floor(Number(before) / 1000);
    thus_val_list[thus_val_list.length] = "" + Math.floor(Number(after) / 1000);
  }

  //alert("Time: " + time_in_break_sec);
  localStorage.setItem(datnow, thus_val_list.join(',')); 
}

function lsw_UpdateTableAtDate(date, what) // like "2023/04/11", "date" (options: date, joined, left, total, worked)
{
    let element = document.getElementById(date + "-" + what);
    if (element == null) return;

    const i = __getLSDateInfo(date);
    if (i == null) return;
    
    if (what == "date"){
        // why?
        return;
    }
    else if (what == "joined"){
        element.innerHTML = (__dateToStr(Number(i[0])));
    }
    else if (what == "left"){
        element.innerHTML = (i[1] == 0 ? "not left" : __dateToStr(Number(i[1])));
    }
    else if (what == "total"){
        element.innerHTML = (__timeToStr(Number(i[2])));
    }
    else if (what == "worked"){
        element.innerHTML = (i[1] == 0 ? "not left" : __timeToStr(Number(i[1]) - Number(i[0]) - Number(i[2])))
    }
    else {
        alert("Invalid call. Error: UpdateTableAtDate('" + date + "','" + what + "' <- error)");
    }
}

function lsw_UpdateTableToday(what)
{
    lsw_UpdateTableAtDate(__getDateStr(), what);
}

function lsw_BuildTable(elem, month, year)
{
  let el = document.getElementById(elem);
  if (el == null) {
      alert("Failed to load table from " + elem);
      return;
  }

  __buildTable_last = elem;

  {
      const dat = new Date();
      if (month == null || month == "") {
          month = "" + (dat.getMonth() + 1);
      }
      if (year == null || year == "") {
          year = "" + dat.getFullYear();
      }
  }

  let my_table = [];

  let counter = 0;
  for (i in localStorage) {
    if (__startsWith(i, "lsw_d-")) {
      //const thus_val = localStorage.getItem(i);
      const thus_date = i.substring(i.indexOf("-") + 1);

      const itm = __getLSDateInfo(thus_date);
      if (itm == null) {
        console.log("Item '" + i + "' was weird. Skipped.");
        continue;
      }
      
      my_table[counter] = [
        itm[0],
        thus_date,
        itm[1],
        itm[2]
      ];
      
      counter++;
    }
  }

  console.log("Sort:\n" + my_table.sort(function(a,b){return b[0] - a[0]})); // higher first (newest)
  console.log(my_table);
    
  let new_dat = "<table class='em-c-table'> \
      <thead class='em-c-table__header'> \
      <tr class='em-c-table__header-row'> \
      <th scope='col' class='em-c-table__header-cell '>Date</th> \
      <th scope='col' class='em-c-table__header-cell '>Joined</th> \
      <th scope='col' class='em-c-table__header-cell '>Left</th> \
      <th scope='col' class='em-c-table__header-cell '>Total break time</th> \
      <th scope='col' class='em-c-table__header-cell '>Time worked</th> \
      </tr>\
      <!-- em-c-table__header-row -->\
      </thead> \
      <!-- end em-c-table__header -->\
      <tbody class='em-c-table__body'>";

  const limit_lines = my_table.length > 500 ? 500 : my_table.length;

  for(let val = 0; val < limit_lines; ++val) {
    let i = my_table[val];
    //alert("item: " + i[0] + ";" + i[1] + ";" + i[2] + ";" + i[3]);
    
    new_dat += "<tr class='em-c-table__row '>\
      \
      <td class='em-c-table__cell ' colspan='' id='" + (i[1] + "-date") + "'>" +
      (i[1]) + 
      "</td>\
      \
      <td class='em-c-table__cell ' colspan='' id='" + (i[1] + "-joined") + "'>" + 
      (__dateToStr(Number(i[0]))) +
      "</td>\
      \
      <td class='em-c-table__cell ' colspan='' id='" + (i[1] + "-left") + "'>" + 
      (i[2] == 0 ? "not left" : __dateToStr(Number(i[2]))) +
      "</td>\
      \
      <td class='em-c-table__cell ' colspan='' id='" + (i[1] + "-total") + "'>" +
      (__timeToStr(Number(i[3]))) +
      "</td>\
      \
      <td class='em-c-table__cell ' colspan='' id='" + (i[1] + "-worked") + "'>" +
      (i[2] == 0 ? "not left" : __timeToStr(Number(i[2]) - Number(i[0]) - Number(i[3]))) +
      "</td>\
    </tr>\n";
  }
  
  new_dat += "</tbody>\
      <!-- end em-c-table__body -->\
      <tfoot class='em-c-table__footer'>\
      <tr class='em-c-table__footer-row'>\
      </tr>\
      </tfoot>\
      <!-- end em-c-table__footer -->\
      </table>";

  el.innerHTML = new_dat;
}

function lsw_ExportCalendar() 
{
  let str_dat = "Date,EnterUTC,LeftUTC,Pattern... (enter/exit break time)\n";
  for (i in localStorage) {
    if (__startsWith(i, "lsw_d-")) {
      const thus_dat = i.substring(i.indexOf("-") + 1);
      const thus_val = localStorage.getItem(i);
      str_dat += thus_dat + "," + thus_val + "\n";
    }
  }
  return str_dat;
}

function lsw_ExportToFile() {
  if (typeof detectIEEdge === 'function' ) {
    if (detectIEEdge()) {
      var fileData = [lsw_ExportCalendar()];
      blobObject = new Blob(fileData);
      window.navigator.msSaveOrOpenBlob(blobObject, 'export.csv'); // Now the user will have the option of clicking the Save button and the Open button.
    }
    else {
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(lsw_ExportCalendar()));
      element.setAttribute('download', 'export.csv');

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    }
  }
}

function lsw_ImportFromFile(e)
{
  var file = e.target.files[0];
  if (!file) return;

  if (!confirm("Do you want to merge to what's already in the browser? OK will merge, Cancel will clean up first")) {
    let names_to_del = [];
    let counter = 0;

    if (!confirm("Do you want to reset ALL THINGS or try to just clean up the dates? OK will clear only dates, cancel will CLEAR ALL STORAGE of this website")) {
      localStorage.clear();
      alert("All clear.");
    }
    else {
      for (i in localStorage) {
        if (__startsWith(i, "lsw_d-")) {
          names_to_del[counter] = i;
          counter++;
        }
      }
      for (i in names_to_del) {
        localStorage.removeItem(i);
      }

      console.log("Deleted " + names_to_del.length + " entries");
      alert("Deleted " + names_to_del.length + " item(s)");
    }
  }

  var reader = new FileReader();
  reader.onload = function(e) {
    console.log("Start of import");
    var contents = e.target.result;
    console.log("Got file.");

    var lines = __sliceString(contents, '\n');
    console.log("Parsed file, working...");

    for (let i = 1; i < lines.length; i++)
    {
      let each = __sliceString(lines[i], ',');
      let m_out = "";
      for(let j = 1; j < each.length; ++j) {
        m_out += each[j] + (j == each.length-1 ? "" : ",");
      }
      
      console.log("Adding " + each[0] + " with val: '" + m_out + "'");

      localStorage.setItem("lsw_d-" + each[0], m_out);
    }
    
    console.log("Updating table at " + __buildTable_last);
    lsw_BuildTable(__buildTable_last);
    console.log("Updated table at " + __buildTable_last + ". End of import");
  };

  reader.readAsText(file);
}

function lsw_MapButtonInput(button, input)
{
  document.getElementById(button).addEventListener("click", function(){
    document.getElementById(input).click();
  });
}

function lsw_UpdateWorkTimeAt(week_time)
{
  let element = document.getElementById(week_time);
  if (!element) return;

  const working_days = __getCurrentWeekDays();
  let total_work_week = 0;

  for(let c = 0; c < working_days.length; ++c) {
    const i = working_days[c];
    const itm = __getLSDateInfo("" + i.getFullYear() + "/" + (i.getMonth() + 1) + "/" + i.getDate());
    if (itm == null) continue;
    if (itm[1] == 0) continue;

    total_work_week += Number(itm[1]) - Number(itm[0]) - Number(itm[2]);
  }

  element.innerHTML = "Total work this week: " + __timeToStr(total_work_week);
}