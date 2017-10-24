'use strict';

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

//function to build  the array of arrays of hours and cookies sold
//[['hour', 'number of cookies'], '['hour', 'number of cookies']'....]
function createCookiesHours(openHr, closeHr, avgCookies, thisShop){
  console.log('openHr: ', openHr, 'closeHr: ', closeHr);
  console.log('thisShop: ', thisShop);
  //convert opening and closing times to 24hr clock numbers
  // use this as counter start and stop
  var startHr = time24(openHr);
  var stopHr = time24(closeHr);

  //array to hold data to return to object method
  var hrArr = [];
  var amPm = 'am';
  var cookiesPerHour;
  var random_num;
  var hrStr;
  //cookie counter to push back to object method
  var cookieTotal = 0;
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

    //the number needs to be random everytime
    //thisShop refers to the object whose method called the function
    random_num = thisShop.randomCustomers();

    //convert partial cookies to whole cookies
    cookiesPerHour = Math.ceil(avgCookies * random_num);

    cookieTotal = cookieTotal + cookiesPerHour;
    console.log('hrStr', hrStr);
    console.log('avgCookies: ', avgCookies);
    console.log('thisShop.randomCustomers()', random_num);
    console.log('cookiesPerHour', cookiesPerHour);
    hrArr.push([hrStr, cookiesPerHour]);

  }
  //return array of an array of hours and cookiesPerHour
  //and cookie total for shop
  return [hrArr, cookieTotal];
}

//Helper function to build the unordered list
function buildList(hoursArray, cTotal){
  var listItems = [];
  //loop through the array of hours and cookies arrays
  for (var i = 0; i < hoursArray.length; i++){
    //join each hours and cookies array with ': '
    //8am: 100 Cookies
    listItems.push(hoursArray[i].join(': ') + ' cookies');
  }
  //Add the total to the array
  listItems.push('Total: ' + cTotal);
  //convert the array into HTML for an ul with li's
  var listItemsStr = '<ul><li>' + listItems.join('</li><li>') + '</li></ul>';
  return listItemsStr;
}

//Define constructor for shop
function Shop(shopLocation, min_customer_hr, max_customer_hr, avg_cookies_hr, hour_open, hour_close) {
  this.shopLocation = shopLocation;
  this.min_customer_hr = min_customer_hr;
  this.max_customer_hr = max_customer_hr;
  this.avg_cookies_hr = avg_cookies_hr;
  this.hour_open = hour_open;
  this.hour_close = hour_close;
  this.shop_hrs_cookies = [];
  this.totalCookies = '';
  this.ul = '';
};

Shop.prototype.randomCustomers = function(){
  return randomCustomerGeneratior(this.min_customer_hr, this.max_customer_hr);
};

Shop.prototype.create_shop_hrs_cookies = function (){
  var cookieData = createCookiesHours(this.hour_open, this.hour_close, this.avg_cookies_hr, this);
  this.shop_hrs_cookies = cookieData[0];
  this.totalCookies = cookieData[1];
};

Shop.prototype.create_list = function(){
  this.ul = buildList(this.shop_hrs_cookies, this.totalCookies);
};

//create new shops
var shop_1 = new Shop('1st and Pike', 23, 65, 6.3, '6am', '8pm');
var shop_2 = new Shop('SeaTac Airport', 33, 24, 1.2, '6am', '8pm');
var shop_3 = new Shop('Seattle Center', 11, 38, 3.7, '6am', '8pm');
var shop_4 = new Shop('Capitol Hill', 20, 38, 2.3, '6am', '8pm');
var shop_5 = new Shop('Alki', 2, 16, 4.6, '6am', '8pm');

//create array of shops
var shops = [shop_1, shop_2, shop_3, shop_4, shop_5];
console.log(shops);
var section;

if (document.title.toLowerCase().indexOf('sales') > 0){
  buildSalesPage();
}
else{
  buildStoreHours();
}


function buildSalesPage(){
  //loop through each shop
  // call the create_shop_hrs_cookies() method to build the array of shop hours and cookies
  // call the  create_list(); method to bulid the unordered list as a string
  for (var i = 0; i < shops.length; i++){
    shops[i].create_shop_hrs_cookies();
    shops[i].create_list();
    //create a new section
    section = document.createElement('section');
    //build the inner html
    var shop_location_tag = 'p';
    var shop_location = '<' + shop_location_tag + '>' + shops[i].shopLocation + '</' + shop_location_tag + '>';
    //insert the html and add it to the document
    section.innerHTML = shop_location + shops[i].ul;
    var salesData_div = document.getElementById('sales-data');
    //  document.body.appendChild(section);
    salesData_div.appendChild(section);
  }
}

function buildStoreHours(){
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
  var store_locations = document.getElementById('store_locations');
  store_locations.appendChild(storeP);
  store_locations.appendChild(ulEl);
}

console.log('shops: ',shops);
console.log('window.location: ', window.location);
console.log(document.title);
console.log('document.title.toLowerCase().indexOf', document.title.toLowerCase().indexOf('sales'));
