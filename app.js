'use strict';

var sales_table_ref = document.getElementById('sales-table');
var locations_table_ref = document.getElementById('store_locations');
var new_tHead;
var new_tBody;
var new_table_row;
var new_tFoot;

function Shop(shopLocation, min_customer_hr, max_customer_hr, avg_cookies_hr, hour_open, hour_close) {
  this.shopLocation = shopLocation;
  this.min_customer_hr = min_customer_hr;
  this.max_customer_hr = max_customer_hr;
  this.avg_cookies_hr = avg_cookies_hr;
  this.shop_hours = {open: hour_open, close: hour_close};
  this.shop_hours_array = [];
  this.standard_hours = {open:'6am', close:'8pm'};
  this.standard_hours_array = [];
  //array of [[hour, cookies sold], [hour, cookies sold]...]
  this.shop_hrs_cookies = [];
  //total cookies sold in a day
  this.totalCookies = '';
  //string of tds to be put in a tr
  this.cookie_td_str = '';
  //string of html for header row <tr><td></td>,<td></td> ... </tr>
  this.headerRow = '';
  //sales.html table id
  this.salesTableId = 'sales-table';
  //index.html table id
  this.homeTableId = 'store_locations';
};

//create random nnumber of customers
Shop.prototype.randomCustomers = function(){
  return randomCustomerGeneratior(this.min_customer_hr, this.max_customer_hr);
};

Shop.prototype.create_store_hours_data = function(){
  this.shop_hours_array = hours_array(this.shop_hours.open, this.shop_hours.close);
  this.standard_hours_array = hours_array(this.standard_hours.open, this.standard_hours.close);
  this.calc_cookies_per_hr();
  this.create_row_data();
}

//create array of shop hours based on open and close times
//along with cookies per hour and total cookies per day
Shop.prototype.calc_cookies_per_hr = function (){
  var cookieData = createCookiesHours(this.shop_hours_array, this.standard_hours_array, this.avg_cookies_hr, this);
  this.shop_hrs_cookies = cookieData[0];
  this.totalCookies = cookieData[1];
};

//create html string of table data for table row
Shop.prototype.create_row_data = function(){
  var row_data = build_table_row(this.shop_hrs_cookies, this.standard_hours_array, this.shopLocation, this.totalCookies);
  this.cookie_td_str = row_data[0];
  this.headerRow = row_data[1];
};

//insert table data row on the  page
Shop.prototype.insert_sales_row = function() {
  //calulate the cookies per hour
  this.create_store_hours_data();
  //create the data string for the row
  this.create_row_data();
  //create the new row for the the data string
  var newRow = document.createElement('tr');
  //add the data string to the row
  newRow.innerHTML = this.cookie_td_str;
  //get a reference to the table using id
  var theTable = document.getElementById(this.salesTableId);sales-table
  //check to see if the table head was created, if not create it
  table_head_check(theTable, this.headerRow);
  //make sure there is a table body, if not tehn create it
  var tableBody = table_body_check(theTable);
  //add the row to the table on the page
  tableBody.appendChild(newRow);
  //update the foot if it exist with new totals, create if missing
  //update_footer(theTable, this.shop_hrs_cookies, this.totalCookies);
};


/*
//create new shops
var shop_1 = new Shop('1st and Pike', 23, 65, 6.3, '6am', '8pm');
var shop_2 = new Shop('SeaTac Airport', 33, 24, 1.2, '6am', '8pm');
var shop_3 = new Shop('Seattle Center', 11, 38, 3.7, '6am', '8pm');
var shop_4 = new Shop('Capitol Hill', 20, 38, 2.3, '6am', '8pm');
var shop_5 = new Shop('Alki', 2, 16, 4.6, '6am', '8pm');
*/
//create array of shops
//var shops = [shop_1, shop_2, shop_3, shop_4, shop_5];

//shops[0].create_shop_hrs_cookies();

//console.log('this_shop', shops[0]);

var shop_1 = new Shop('1st and Pike', 23, 65, 6.3, '8am', '4pm');
var shop_2 = new Shop('SeaTac Airport', 33, 24, 1.2, '6am', '8pm');
var shop_3 = new Shop('Seattle Center', 11, 38, 3.7, '6am', '8pm');
var shop_4 = new Shop('Capitol Hill', 20, 38, 2.3, '6am', '8pm');
var shop_5 = new Shop('Alki', 2, 16, 4.6, '6am', '8pm');

var shops = [shop_1, shop_2, shop_3, shop_4, shop_5];
build_sales_table();

function build_sales_table(){
  create_all_store_data();
  build_table_header();
  build_table_body();
  build_table_footer();
}


function create_all_store_data(){
  for (var i = 0; i < shops.length; i++){
    shops[i].create_store_hours_data();
  }
}

function build_table_header(){
  new_tHead = document.createElement('thead');
  new_tHead.innerHTML = shops[0].headerRow;
  sales_table_ref.appendChild(new_tHead);
}

function build_table_body(){
  new_tBody = sales_table_ref.getElementsByTagName('tbody')
  if (! new_tBody.length){
    new_tBody = document.createElement('tbody');
  } else {
    new_tBody = new_tBody[0];
  }
  for (var i = 0; i < shops.length; i++){
    new_table_row = document.createElement('tr');
    new_table_row.innerHTML = shops[i].cookie_td_str;
    new_tBody.appendChild(new_table_row);
  }
  sales_table_ref.appendChild(new_tBody);
  console.log('new_tBody', new_tBody);
}

function build_table_footer(){
  var footer_data = get_column_totals();
  update_footer(footer_data);
}

function get_column_totals(){
  var hourly_totals = ['Hourly Totals'];
  var tr_tds;
  var td_value;
  var columnTotal;
  var sales_table_rows = new_tBody.getElementsByTagName('tr');
  //console.log('sales_table_rows', sales_table_rows);
  var column_count = sales_table_rows[0].getElementsByTagName('td').length;
  //console.log('column_count: ', column_count)

  for (var column = 1; column < column_count; column++){
  //  console.log('column: ', column);
    columnTotal = 0;
    for (var i = 0; i < sales_table_rows.length; i++){
      tr_tds = sales_table_rows[i].getElementsByTagName('td')
    //  console.log('td_value', tr_tds[column].textContent)

      td_value = parseInt(tr_tds[column].textContent)
      if (isNaN(td_value)) {
        td_value = 0;
      }
      columnTotal += td_value
    //  console.log('totals: ', column, columnTotal)
    }
      hourly_totals.push(columnTotal);
  }
  console.log('hourly_totals', hourly_totals);
  return hourly_totals;
}
//new_tFoot = document.createElement('tfoot');
//new_table_row = document.createElement('tr');



console.log('shops', shops);
//shop_1.create_store_hours_data();
//console.log('Hours: ',shop_1);


function hours_array(openHr, closeHr){
  console.log('openHr: ', openHr, 'closeHr: ', closeHr);
  //convert opening and closing times to 24hr clock numbers
  // use this as counter start and stop
  var startHr = time24(openHr);
  var stopHr = time24(closeHr);

  //array to hold data to return to object method
  var hrArr = [];
  var amPm = 'am';
  var hrStr;

  for (var i = startHr; i <= stopHr; i++){
    var hr12Num = i;
    //convert i into 12 clock number
    //13 = 1
    if (i >= 12){
      amPm = 'pm';
      if (i != 12){
        hr12Num = i - 12;
      }
    }
    //add am or pm to hour
    hrStr = hr12Num.toString() + amPm;
    //console.log('hrStr: ',  hrStr);
    hrArr.push(hrStr);
  }
  return hrArr;
}


/*
//if the script is loaded on the sales page, create the salse table
if (document.title.toLowerCase().indexOf('sales') > 0){

  for (var i = 0; i < shops.length; i++){
    console.log('name: ', shops[i].shopLocation);
    shops[i].insert_sales_row();
  }

}
//if the script is loaded on the index page, create the store info table
else{
  buildStoreHours(shops[0].homeTableId);
}
*/

//check the header
function table_head_check(target_table, table_header_row) {
  // get a reference to the table head in the target table
  // if it is missing, create it
  var tableHead = target_table.getElementsByTagName('thead');
  if (tableHead.length === 0) {
    tableHead = document.createElement('thead');
    tableHead.innerHTML = table_header_row;
    target_table.appendChild(tableHead);
  }
}

//check the body
function table_body_check(theTable) {
  // get a reference to the table body in theTable
  // if it is missing, create it
  var theBody = theTable.getElementsByTagName('tbody');
  if (theBody.length === 0){
    console.log('No Body');
    var newBody = document.createElement('tbody');
    return theTable.appendChild(newBody);
  }
  return theBody[0];
}

function update_footer(hourTotals){
  var theFoot = sales_table_ref.getElementsByTagName('tfoot');
  if (theFoot.length === 0 ){
     var newFoot = document.createElement('tfoot');
     theFoot = sales_table_ref.appendChild(newFoot);
  } else {
    theFoot = theFoot[0];
  }
    var tfoot_row_string = '<tr><td>' + hourTotals.join('</td><td>') + '</td></tr>';
    console.log('footer rowString: ', tfoot_row_string);
    theFoot.innerHTML = tfoot_row_string;
    //theFoot = sales_table_ref.appendChild(newFoot);

}

/*
// update the value of the totals in the footer
function update_footer(target_table, cookies_hr_array, daily_total) {
  var hourTotals = ['Hourly Totals'];
  for (var i = 0; i < cookies_hr_array.length; i++){
    console.log('cookies_hr_array[1]',cookies_hr_array[i][1]);
    hourTotals.push(cookies_hr_array[i][1]);
  }
  //add the daily total to the end
  hourTotals.push(daily_total);
  console.log('hourTotals:', hourTotals);
  // get a reference to the table footer in the target table
  // if it is missing, create it
  var theFoot = target_table.getElementsByTagName('tfoot');
  if (theFoot.length === 0 ){
    var newFoot = document.createElement('tfoot');
    var rowString = '<tr><td>' + hourTotals.join('</td><td>') + '</td></tr>';
    console.log('rowString: ', rowString);
    newFoot.innerHTML = rowString;
    theFoot = target_table.appendChild(newFoot);
    return;
  }
  // if the foot exists update teh totals
  // loop through the tds, except for the labe, whcih is first
  //and grb the current value then add the hourly total for the row just added
  var footerTds = theFoot[0].getElementsByTagName('td');
  console.log('footerTds', footerTds);
  for (var j = 1; j < footerTds.length; j++){
    console.log('footerTds[j]: ', footerTds[j]);
    //get the current value then parse into a number
    var textVal = footerTds[j].textContent;
    console.log('textVal: ', textVal);
    var currentValue = parseInt(textVal);
    var newValue = currentValue + hourTotals[j];
    //update the current td
    footerTds[j].textContent = newValue;

  }
}
*/

function createCookiesHours(shopHours, standardHours, avgCookies, thisShop) {
  var hours_cookies_array = [];
  var cookieTotal = 0;
  var cookiesPerHour;
  var random_num;
  var strDelim = '*'
  var searchStr;
  //create string to use to check the existance of an hour ie 3pm
  var shopHours_search_string = strDelim + shopHours.join('*') + strDelim;
  for (var i = 0; i < standardHours.length; i++){
    //check to see if the ShopHours array contains a standard hour
    //if not then the store is closed at that hour
    searchStr = strDelim + standardHours[i] + strDelim;
  //  console.log('match? ', standardHours[i], shopHours_search_string.indexOf(searchStr));
    if (shopHours_search_string.indexOf(searchStr) > -1) {
      //the number needs to be random everytime
      //thisShop refers to the object whose method called the function
      random_num = thisShop.randomCustomers();

      //convert partial cookies to whole cookies
      cookiesPerHour = Math.ceil(avgCookies * random_num);
      cookieTotal += cookiesPerHour;
    } else {
      cookiesPerHour = 'closed';
    }
  //  console.log('[standardHours[i], cookiesPerHour]', standardHours[i], cookiesPerHour);
    hours_cookies_array.push([standardHours[i], cookiesPerHour]);
  }
  //return array of an array of hours and cookiesPerHour
  //and cookie total for shop
  return [hours_cookies_array, cookieTotal];
}

//function to convert opening and closing hours to 24hr time
// helper function for building hours array
function time24(convert_hr_str){
  //parse the end of the string to get either am or pm
  var hr12_check = convert_hr_str.substring(convert_hr_str.length - 2);
  //coerce the time string into a number
  var hrNum = parseInt(convert_hr_str);
  //if the time string is a number, convert the time to 24 clock
  // 1pm = 13
  if (hr12_check.toLowerCase() === 'pm'){
    hrNum = hrNum + 12;
  }
  return hrNum;
}

//function to generate a random number of customers based on the min amd max values
function randomCustomerGeneratior(min_num, max_num){
  return Math.floor((Math.random() * (max_num - min_num)) + min_num);
}

/*
function build_table_header_data(hoursArr){
  for (var i = 0; i < hoursArr.length; i++){

  }
}
*/

//Helper function to build the table row
function build_table_row(hoursArray, stand_HrsArr, shop_location, daily_total){
  var rowItems = [];
  var headTHs = [];
  //start the array witht the shop location
  rowItems.push(shop_location);

  //push empty string as palce holder for first cell in header which is empty
  headTHs.push('');

  //loop through the array of hours and cookies arrays
  for (var i = 0; i < stand_HrsArr.length; i++){
    //add all hourly lotals to array
    rowItems.push(hoursArray[i][1]);
    //add each hout to the header array
    headTHs.push(stand_HrsArr[i]);
  }

  //add daily total quantity to the end of the array
  rowItems.push(daily_total);
  //convert the array into HTML string with with tds
  var rowItemsStr = '<td>' + rowItems.join('</td><td>') + '</td>';
  //add daily totals header label to the end of the array
  headTHs.push('Daily Totals');
  //create the header row html string
  var headTHsStr = '<tr><th>' + headTHs.join('</th><th>') + '</th></tr>';

  return [rowItemsStr, headTHsStr];
}

//function hourlyTotals(salesTable){}


////////////////////////////
//still using on index.html
// create store hours for the index page
function buildStoreHours(store_locations_id){
  var locations = [];
  for (var i = 0; i < shops.length; i++){
    locations.push('<span>' + shops[i].shopLocation + '</span><span class="open-hour">' + shops[i].hour_open + '</span><span>' + shops[i].hour_close + '</span>');
  }
  var locations_li = '<li>' + locations.join('</li><li>') + '</li>';
  var ulEl = document.createElement('ul');
  ulEl.innerHTML = locations_li;
  console.log('ulEl:', ulEl);
  var storeP = document.createElement('p');
  storeP.innerHTML = '<span>Location</span><span>Open</span><span>Close</span>';
  var store_locations = document.getElementById(store_locations_id);
  store_locations.appendChild(storeP);
  store_locations.appendChild(ulEl);
}
/////////////////////////////////
//////////////////////////////////
