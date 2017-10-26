'use strict';

var sales_table_ref = document.getElementById('sales-table');
var locations_table_ref = document.getElementById('store_locations');
var admin_form = document.getElementById('admin_form');
var new_tHead;
var new_tBody;
var new_table_row;

//Create Shop Object constructor
function Shop(shopLocation, min_customer_hr, max_customer_hr, avg_cookies_hr, hour_open, hour_close) {
  this.shopLocation = shopLocation;
  this.min_customer_hr = min_customer_hr;
  this.max_customer_hr = max_customer_hr;
  this.avg_cookies_hr = avg_cookies_hr;
  this.shop_hours = {open: hour_open, close: hour_close};
  //array of each hour open
  this.shop_hours_array = [];
  this.standard_hours = {open:'6am', close:'8pm'};
  //array of standard hours
  this.standard_hours_array = [];
  //array of [[hour, cookies sold], [hour, cookies sold]...]
  this.shop_hrs_cookies = [];
  //total cookies sold in a day
  this.totalCookies = '';
  //string of tds to be put in a tr
  this.cookie_td_str = '';
  //string of html for header row <tr><td></td>,<td></td> ... </tr>
  this.headerRow = '';
};

//create random nnumber of customers
Shop.prototype.randomCustomers = function(){
  return randomCustomerGeneratior(this.min_customer_hr, this.max_customer_hr);
};

//populate the properties for use in tabel creation
Shop.prototype.create_store_hours_data = function(){
  //create array of hours open based on open and closing times
  this.shop_hours_array = hours_array(this.shop_hours.open, this.shop_hours.close);
  //build array of possible hours open (standard hours open)
  this.standard_hours_array = hours_array(this.standard_hours.open, this.standard_hours.close);
  //calculate cookiws per sold hour open
  this.calc_cookies_per_hr();
  //build data string of tds for table
  this.create_row_data();
};

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

//fill the table with a few shops to start
var shop_1 = new Shop('1st and Pike', 23, 65, 6.3, '6am', '7pm');
var shop_2 = new Shop('SeaTac Airport', 33, 24, 1.2, '6am', '8pm');
var shop_3 = new Shop('Seattle Center', 11, 38, 3.7, '8am', '6pm');

//create array to hold all shops
var shops = [shop_1, shop_2, shop_3];
console.log('shops:', shops);
//build out the table with initial data
build_sales_table();

//button to close the add new store form
var cancel_btn = document.getElementById('cancel_btn');
//bind click to cancel button
cancel_btn.addEventListener('click', closeEditor);

//button to open add new store window
var open_editor_btn = document.getElementById('open_editor_btn');
//bind click to open add new store window
open_editor_btn.addEventListener('click', openEditor);

//function to close add new store window
function closeEditor(event) {
  event.preventDefault();
  var edit_window = document.getElementById('table_editor');
  edit_window.style.display = 'none';
  document.getElementsByClassName('sales-data')[0].style.opacity = 1;
}
//function to open add new store window
function openEditor(event) {
  event.preventDefault();
  var edit_window = document.getElementById('table_editor');
  document.getElementsByClassName('sales-data')[0].style.opacity = .5;
  edit_window.style.display = 'block';

}

//function to get form data
function get_form_data(event) {
  //do not run default action of event
  event.preventDefault();
  var storeLocation = event.target.store_location.value;
  var open_hr = event.target.open.value;
  var close_hr = event.target.close.value;
  var minimumCustomers = event.target.min_customers.value;
  var maximumCustomers = event.target.max_customers.value;
  var average_cookies = event.target.average_cookies.value;

  var newShop = new Shop(storeLocation, minimumCustomers, maximumCustomers, average_cookies, open_hr, close_hr);
  console.log(newShop);
  shops.push(newShop);

  //create our table here
  build_sales_table();
  //reset the form data
  admin_form.reset();
  //change cancel button text to say close after adding a row
  cancel_btn.textContent = 'Close';

}

//bind the form submitt button
admin_form.addEventListener('submit', get_form_data);

function build_sales_table(){
  create_all_store_data();
  //if the script is loaded on the index page, create the store info table
  if (document.title.toLowerCase().indexOf('sales') === -1){
    buildStoreHours(locations_table_ref);
  } else {
    //reset table
    sales_table_ref.innerHTML = '';
    build_table_header();
    build_table_body();
    build_table_footer();
  }
}


function create_all_store_data(){
  for (var i = 0; i < shops.length; i++){
    //call  method of shops
    shops[i].create_store_hours_data();
  }
}

function build_table_header(){
  new_tHead = document.createElement('thead');
  //add the headerRow property from any of the shops as the header row
  new_tHead.innerHTML = shops[0].headerRow;
  sales_table_ref.appendChild(new_tHead);
}

function build_table_body(){
  /*
  new_tBody = sales_table_ref.getElementsByTagName('tbody');

  if (! new_tBody.length){

  } else {
    new_tBody = new_tBody[0];
  }
  */
  new_tBody = document.createElement('tbody');
  for (var i = 0; i < shops.length; i++){
    new_table_row = document.createElement('tr');
    new_table_row.innerHTML = shops[i].cookie_td_str;
    new_tBody.appendChild(new_table_row);
  }
  sales_table_ref.appendChild(new_tBody);
  console.log('new_tBody', new_tBody);
}

function build_table_footer(){
  //create hourly totals for all stores
  var footer_data = get_column_totals();
  //build the footer
  update_footer(footer_data);
}

function get_column_totals(){
  //array to hold hourly totals, start with a label name
  var hourly_totals = ['Hourly Totals'];
  var tr_tds;
  var td_value;
  var columnTotal;
  //get all the rows from the table body
  var sales_table_rows = new_tBody.getElementsByTagName('tr');
  //get count of columns in the table
  var column_count = sales_table_rows[0].getElementsByTagName('td').length;
  //start at the second colum since the first is locations
  // loop through each row grabbing the colum by column index
  for (var column = 1; column < column_count; column++){
    // running total for each column
    columnTotal = 0;
    for (var i = 0; i < sales_table_rows.length; i++){
      //get array of tds from the row
      tr_tds = sales_table_rows[i].getElementsByTagName('td');
      //get value of td at column index  and parse as number
      td_value = parseInt(tr_tds[column].textContent);
      //if the value is NaN the set the value to zero because the store is closed at that hour
      if (isNaN(td_value)) {
        td_value = 0;
      }
      //aggregate the total
      columnTotal += td_value;
    }
    //push the column total to the array
    hourly_totals.push(columnTotal);
  }
  //console.log('hourly_totals', hourly_totals);
  return hourly_totals;
}

function update_footer(hourTotals){
  /*
  var theFoot = sales_table_ref.getElementsByTagName('tfoot');
  if (theFoot.length === 0 ){
    var newFoot = document.createElement('tfoot');
    theFoot = sales_table_ref.appendChild(newFoot);
  } else {
    theFoot = theFoot[0];
  }
  */
  var newFoot = document.createElement('tfoot');
  var theFoot = sales_table_ref.appendChild(newFoot);
  //create the string for the hourly totals in the footer
  var tfoot_row_string = '<tr><td>' + hourTotals.join('</td><td>') + '</td></tr>';
  //console.log('footer rowString: ', tfoot_row_string);
  theFoot.innerHTML = tfoot_row_string;
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

function createCookiesHours(shopHours, standardHours, avgCookies, thisShop) {
  var hours_cookies_array = [];
  var cookieTotal = 0;
  var cookiesPerHour;
  var random_num;
  var strDelim = '*';
  var searchStr;
  //create string to use to check the existance of an hour ie 3pm
  var shopHours_search_string = strDelim + shopHours.join('*') + strDelim;
  for (var i = 0; i < standardHours.length; i++){
    //check to see if the ShopHours array contains a standard hour
    //if not then the store is closed at that hour
    searchStr = strDelim + standardHours[i] + strDelim;
    //console.log('match? ', standardHours[i], shopHours_search_string.indexOf(searchStr));
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

////////////////////////////
//still using on index.html
// create store hours for the index page
function buildStoreHours(store_locations_section){
  var locations = [];
  for (var i = 0; i < shops.length; i++){
    locations.push('<span>' + shops[i].shopLocation + '</span><span class="open-hour">' + shops[i].shop_hours.open + '</span><span>' + shops[i].shop_hours.close + '</span>');
  }
  var locations_li = '<li>' + locations.join('</li><li>') + '</li>';
  var ulEl = document.createElement('ul');
  ulEl.innerHTML = locations_li;
  console.log('ulEl:', ulEl);
  var storeP = document.createElement('p');
  storeP.innerHTML = '<span>Location</span><span>Open</span><span>Close</span>';
  //var store_locations = document.getElementById(store_locations_id);
  store_locations_section.appendChild(storeP);
  store_locations_section.appendChild(ulEl);
}
/////////////////////////////////
//////////////////////////////////
