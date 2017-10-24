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

//Shop 1 object
var shop_1 = {
  shopLocation: '1st and Pike',
  min_customer_hr: 23,
  max_customer_hr: 65,
  avg_cookies_hr: 6.3,
  hour_open: '6am',
  hour_close: '8pm',
  shop_hrs_cookies: [],
  totalCookies: '',
  ul: '',
  randomCustomers: function(){
    return randomCustomerGeneratior(this.min_customer_hr, this.max_customer_hr);
  },
  create_shop_hrs_cookies: function (){
    var cookieData = createCookiesHours(this.hour_open, this.hour_close, this.avg_cookies_hr, this);
    this.shop_hrs_cookies = cookieData[0];
    this.totalCookies = cookieData[1];
  },
  create_list: function(){
    this.ul = buildList(this.shop_hrs_cookies, this.totalCookies);
  }

};

//Shop 2 object
var shop_2 = {
  shopLocation: 'SeaTac Airport',
  min_customer_hr: 33,
  max_customer_hr: 24,
  avg_cookies_hr: 1.2,
  hour_open: '6am',
  hour_close: '8pm',
  shop_hrs_cookies: [],
  totalCookies: '',
  randomCustomers: function(){
    return randomCustomerGeneratior(this.min_customer_hr, this.max_customer_hr);
  },
  create_shop_hrs_cookies: function (){
    var cookieData = createCookiesHours(this.hour_open, this.hour_close, this.avg_cookies_hr, this);
    this.shop_hrs_cookies = cookieData[0];
    this.totalCookies = cookieData[1];
  },
  create_list: function(){
    this.ul = buildList(this.shop_hrs_cookies, this.totalCookies);
  }
};

//Shop 3 object
var shop_3 = {
  shopLocation: 'Seattle Center',
  min_customer_hr: 11,
  max_customer_hr: 38,
  avg_cookies_hr: 3.7,
  hour_open: '6am',
  hour_close: '8pm',
  shop_hrs_cookies: [],
  totalCookies: '',
  randomCustomers: function(){
    return randomCustomerGeneratior(this.min_customer_hr, this.max_customer_hr);
  },
  create_shop_hrs_cookies: function (){
    var cookieData = createCookiesHours(this.hour_open, this.hour_close, this.avg_cookies_hr, this);
    this.shop_hrs_cookies = cookieData[0];
    this.totalCookies = cookieData[1];
  },
  create_list: function(){
    this.ul = buildList(this.shop_hrs_cookies, this.totalCookies);
  }
};

//Shop 4 object
var shop_4 = {
  shopLocation: 'Capitol Hill',
  min_customer_hr: 20,
  max_customer_hr: 38,
  avg_cookies_hr: 2.3,
  hour_open: '6am',
  hour_close: '8pm',
  shop_hrs_cookies: [],
  totalCookies: '',
  randomCustomers: function(){
    return randomCustomerGeneratior(this.min_customer_hr, this.max_customer_hr);
  },
  create_shop_hrs_cookies: function (){
    var cookieData = createCookiesHours(this.hour_open, this.hour_close, this.avg_cookies_hr, this);
    this.shop_hrs_cookies = cookieData[0];
    this.totalCookies = cookieData[1];
  },
  create_list: function(){
    this.ul = buildList(this.shop_hrs_cookies, this.totalCookies);
  }
};

//Shop 4 object
var shop_5 = {
  shopLocation: 'Alki',
  min_customer_hr: 2,
  max_customer_hr: 16,
  avg_cookies_hr: 4.6,
  hour_open: '6am',
  hour_close: '8pm',
  shop_hrs_cookies: [],
  totalCookies: '',
  randomCustomers: function(){
    return randomCustomerGeneratior(this.min_customer_hr, this.max_customer_hr);
  },
  create_shop_hrs_cookies: function (){
    var cookieData = createCookiesHours(this.hour_open, this.hour_close, this.avg_cookies_hr, this);
    this.shop_hrs_cookies = cookieData[0];
    this.totalCookies = cookieData[1];
  },
  create_list: function(){
    this.ul = buildList(this.shop_hrs_cookies, this.totalCookies);
  }
};

//create array of shops
var shops = [shop_1, shop_2, shop_3, shop_4, shop_5];

//loop through each shop
// call the create_shop_hrs_cookies() method to build the array of shop hours and cookies
// call the  create_list(); method to bulid the unordered list as a string
for (var i = 0; i < shops.length; i++){
  shops[i].create_shop_hrs_cookies();
  shops[i].create_list();
  //create a new section
  var section = document.createElement('section');
  //build the inner html
  var shop_location_tag = 'p';
  var shop_location = '<' + shop_location_tag + '>' + shops[i].shopLocation + '</' + shop_location_tag + '>';
  //insert the html and add it to the document
  section.innerHTML = shop_location + shops[i].ul;
  document.body.appendChild(section);
}

console.log('shops: ',shops);
