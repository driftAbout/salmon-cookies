'use strict';

var sales_table_ref = document.getElementById('sales-table');
var locations_table_ref = document.getElementById('store_locations');
var admin_form = document.getElementById('admin_form');
var new_tHead;
var new_tBody;
var new_table_row;
var shops = [];
var submitText;
var currentShops = [];

//Create Shop Object constructor
function Shop(shopLocation, min_customer_hr, max_customer_hr, avg_cookies_hr, hour_open, hour_close) {
  this.shopLocation = shopLocation;
  this.min_customer_hr = min_customer_hr;
  this.max_customer_hr = max_customer_hr;
  this.avg_cookies_hr = avg_cookies_hr;
  this.shop_hours = {open: hour_open, close: hour_close};
  //array of each hour open
  //this.shop_hours_array = [];
  this.shop_hours_array = this.hours_array(this.shop_hours.open, this.shop_hours.close);
  this.standard_hours = {open:'6am', close:'8pm'};
  //array of standard hours
  this.standard_hours_array = this.hours_array(this.standard_hours.open, this.standard_hours.close);
  //array of [[hour, cookies sold], [hour, cookies sold]...]
  this.shop_hrs_cookies = [];
  //total cookies sold in a day
  this.totalCookies = 0;
  //string of tds to be put in a tr
  this.cookie_td_str = '';
  //string of html for header row <tr><td></td>,<td></td> ... </tr>
  this.headerRow = '';
  this.calc_cookies_per_hr();
  this.create_row_data();
};

//create random nnumber of customers
Shop.prototype.randomCustomers = function(){
  var min_num = this.min_customer_hr;
  var max_num = this.max_customer_hr;
  return Math.floor((Math.random() * (max_num - min_num)) + min_num);
};

Shop.prototype.hours_array = function(openHr, closeHr){
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
};

//create array of shop hours based on open and close times
//along with cookies per hour and total cookies per day
Shop.prototype.calc_cookies_per_hr = function (){
  var shopHours = this.shop_hours_array;
  var standardHours = this.standard_hours_array;
  var avgCookies = this.avg_cookies_hr;
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
      random_num = this.randomCustomers();

      //convert partial cookies to whole cookies
      cookiesPerHour = Math.ceil(avgCookies * random_num);
      this.totalCookies += cookiesPerHour;
    } else {
      cookiesPerHour = 'closed';
    }
    //  console.log('[standardHours[i], cookiesPerHour]', standardHours[i], cookiesPerHour);
    //this.shop_hrs_cookies.push([standardHours[i], cookiesPerHour]);
    this.shop_hrs_cookies.push({hour: standardHours[i], cookies: cookiesPerHour});
  }
};

//create html string of table data for table row
Shop.prototype.create_row_data = function(){
  var hoursArray = this.shop_hrs_cookies;
  var stand_HrsArr = this.standard_hours_array;
  var rowItems = [];
  var headTHs = [];

  //start the array witht the shop location
  rowItems.push(this.shopLocation);

  //push empty string as palce holder for first cell in header which is empty
  headTHs.push('');

  //loop through the array of hours and cookies arrays
  for (var i = 0; i < stand_HrsArr.length; i++){
    //add all hourly lotals to array
    rowItems.push(hoursArray[i].cookies);
    //add each hout to the header array
    headTHs.push(stand_HrsArr[i]);
  }

  //add daily total quantity to the end of the array
  rowItems.push(this.totalCookies);
  //convert the array into HTML string with with tds
  var rowItemsStr = '<td>' + rowItems.join('</td><td>') + '</td>';
  //add daily totals header label to the end of the array
  headTHs.push('Daily Totals');
  //create the header row html string
  var headTHsStr = '<tr><th>' + headTHs.join('</th><th>') + '</th></tr>';

  this.cookie_td_str = rowItemsStr;
  this.headerRow = headTHsStr;
};

//fill the table with a few shops to start
function init_table_data(){
  var shop_1 = new Shop('1st and Pike', 23, 65, 6.3, '6am', '7pm');
  var shop_2 = new Shop('SeaTac Airport', 24, 33, 1.2, '6am', '8pm');
  var shop_3 = new Shop('Seattle Center', 11, 38, 3.7, '8am', '6pm');

  //create array to hold all shops
  shops = [shop_1, shop_2, shop_3];
  console.log('shops:', shops);
  //build out the table with initial data
  build_sales_table();
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

function build_table_header(){
  new_tHead = document.createElement('thead');
  //add the headerRow property from any of the shops as the header row
  new_tHead.innerHTML = shops[0].headerRow;
  sales_table_ref.appendChild(new_tHead);
}

function build_table_body(){
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
  var shop_cookies;
  var shop_cookie_hr_val;
  var columnTotal;

  //get count of items in the array of hours/cookies
  var column_count = shops[0].shop_hrs_cookies.length;
  // loop through each row grabbing the colum by column index
  for (var column = 0; column < column_count; column++){
    columnTotal = 0;
    for (var i = 0; i < shops.length; i++){
      shop_cookies = shops[i].shop_hrs_cookies;
      //get the number of cookies at the column index and parse as number
      shop_cookie_hr_val = parseInt(shop_cookies[column].cookies);
      //if the value is NaN the set the value to zero because the store is closed at that hour
      if (isNaN(shop_cookie_hr_val)) {
        shop_cookie_hr_val = 0;
      }
      //aggregate the total
      columnTotal += shop_cookie_hr_val;
    }
    //push the column total to the array
    hourly_totals.push(columnTotal);
  }
  //add daily totals
  columnTotal = 0;
  for (var j = 0; j < shops.length; j++) {
    columnTotal += shops[j].totalCookies;
  }
  hourly_totals.push(columnTotal);

  //console.log('hourly_totals', hourly_totals);
  return hourly_totals;
}

function update_footer(hourTotals){
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
  edit_window.classList.remove('active');
  //edit_window.style.display = 'none';
  document.getElementsByClassName('sales-data')[0].style.opacity = 1;
}
//function to open add new store window
function openEditor(event) {
  console.log('open editoe');
  get_shop_edit_data('edit_store');
  event.preventDefault();
  var edit_window = document.getElementById('table_editor');
  document.getElementsByClassName('sales-data')[0].style.opacity = .5;
  edit_window.classList.add('active');
  //edit_window.style.display = 'block';
}

//button to close the add new store form
var left_tab_btn = document.getElementById('left_tab');
var right_tab_btn = document.getElementById('right_tab');
//bind click to cancel button
left_tab_btn.addEventListener('click', toggle_editor_tabs);
right_tab_btn.addEventListener('click', toggle_editor_tabs);

function toggle_editor_tabs(e){
  if(! e.target.className){
    e.target.parentElement.getElementsByClassName('active')[0].classList.remove('active');
    e.target.className = 'active';
  }

  if (e.target.id === 'right_tab'){
    submitText = document.getElementById('submit_btn').textContent;
    console.log('submitText', submitText);
    //css reveals dropdown
    document.getElementById('submit_btn').textContent = 'Save Changes';
    document.getElementById('edit_store').classList.add('active');

  } else {
    document.getElementById('edit_store').classList.remove('active');
    document.getElementById('submit_btn').textContent = submitText;
  }
}

var edit_store_ul = document.getElementById('edit_store');
edit_store_ul.addEventListener('click', toggle_edit_li);

function toggle_edit_li(e){
  console.log('e.target', e.target);
  console.log('lis: ', e.target.parentNode.getElementsByTagName('li').length);
  e.target.parentNode.classList.toggle('show_li');
  console.log('clicked li text', e.target.innerHTML);
  console.log('first li: ', e.target.parentNode.getElementsByTagName('li')[0].innerHTML);
  var li_arr = e.target.parentNode.getElementsByTagName('li');
  for (var indx = 0; indx < li_arr.length; indx++){

    if(e.target.innerHTML === li_arr[indx].innerHTML){
      var li_index = indx - 1;
      console.log('This Li', li_arr[indx].innerHTML, indx);
    }
  }
  console.log('li_index', li_index);
  console.log('clicked Li:' , li_index);
  if (e.target.innerHTML != li_arr[0].innerHTML){
    //currentShops[li_index]
    var store_input = document.getElementsByName('store_location');
    var open_input = document.getElementsByName('open');
    open_input[0].value = currentShops[li_index].open;
    var close_input = document.getElementsByName('close');
    close_input[0].value = currentShops[li_index].close;
    var min_customers_input = document.getElementsByName('min_customers');
    min_customers_input[0].value = currentShops[li_index].min_customer_hr;
    var max_customers_input = document.getElementsByName('max_customers');
    max_customers_input[0].value = currentShops[li_index].max_customer_hr;
    var average_cookies_input = document.getElementsByName('average_cookies');
    average_cookies_input[0].value = currentShops[li_index].avg_cookies_hr;
    console.log('store_input', store_input[0]);
    store_input[0].value = currentShops[li_index].shopLocation;
    //shops.remove(li_index);
    var editShops = [];
    for (var i = 0; i < shops.length; i++){
      if( i != li_index){
        console.log(i, li_index);
        editShops.push(shops[i]);
      }
    }
    shops = editShops;
    e.target.parentNode.classList.toggle('show_li');
    e.target.parentNode.classList.toggle('active');
    left_tab_btn.click();
  }

  //var choices = e.target.parentNode.getElementsByTagName('li');
  //for (var c = 0; c < choices;  c++){
  //  choices[c].classList.add('show_li');
//  }

  //e.target.querySelectorAll('li').classList.add('active');
}

function get_shop_edit_data(ul_id){
  console.log('shops here', shops);
  for (var i = 0; i < shops.length; i++){
    console.log('store_location: ', shops[i].shopLocation);
    currentShops.push(new Shop_form_data(shops[i], ul_id));
  }
}

function Shop_form_data(this_shop, ul_id){
  this.shopLocation = this_shop.shopLocation;
  this.min_customer_hr = this_shop.min_customer_hr;
  this.max_customer_hr = this_shop.max_customer_hr;
  this.avg_cookies_hr = this_shop.avg_cookies_hr;
  this.open = this_shop.shop_hours.open;
  this.close = this_shop.shop_hours.close;
  this.ul_id = ul_id;
  this.makeli();
  this.append_li();
}
Shop_form_data.prototype.makeli = function(){
  var newLi = document.createElement('li');
  newLi.innerHTML = this.shopLocation;
  this.li_tag = newLi;
};

Shop_form_data.prototype.append_li = function(){
  document.getElementById(this.ul_id).appendChild(this.li_tag);
};

////////////////////////////
//still using on index.html
// create store hours for the index page
/*
function buildStoreHours(store_locations_section){
  var shops = [{shopLocation:'1st and Pike', shop_hours.open: '6am', shop_hours.close:'7pm'),
  {shopLocation:'SeaTac Airport', shop_hours.open: '6am', shop_hours.close:'8pm'),
  {shopLocation:'Seattle Center', shop_hours.open: '8am', shop_hours.close:'6pm')];

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
*/
/////////////////////////////////
//////////////////////////////////


init_table_data();
