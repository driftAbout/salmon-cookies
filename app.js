'use strict';

function time24(convert_hr_str){
  var hr12_check = convert_hr_str.substring(convert_hr_str.length - 2);
  var hrNum = parseInt(convert_hr_str);
  if (hr12_check.toLowerCase() === 'pm'){
    hrNum = hrNum + 12;
  }
  return hrNum;
}

function randomCustomerGeneratior(min_num, max_num){
  return Math.floor((Math.random() * (max_num - min_num)) + min_num);
}

function createCookiesHours(openHr, closeHr, avgCookies, thisShop){
  console.log('openHr: ', openHr, 'closeHr: ', closeHr);
  console.log('thisShop: ', thisShop);
  var startHr = time24(openHr);
  var stopHr = time24(closeHr);

  var hrArr = [];
  var amPm = 'am';
  var cookiesPerHour;
  var random_num;
  var hrStr;
  var cookieTotal = 0;
  for (var i = startHr; i <= stopHr; i++){
  //  var hrObject = {};
    var hr12Num = i;
    if (i >= 12){
      amPm = 'pm';
      if (i != 12){
        hr12Num = i - 12;
      }
    }
    hrStr = hr12Num.toString() + amPm;
    random_num = thisShop.randomCustomers();
    cookiesPerHour = Math.ceil(avgCookies * random_num);
    cookieTotal = cookieTotal + cookiesPerHour;
    console.log('hrStr', hrStr);
    console.log('avgCookies: ', avgCookies);
    console.log('thisShop.randomCustomers()', random_num);
    console.log('cookiesPerHour', cookiesPerHour);
  //  hrObject[hrStr] = cookiesPerHour;
  //  hrArr.push(hrObject);
    hrArr.push([hrStr, cookiesPerHour]);

  }
  return [hrArr, cookieTotal];
}

function buildList(hoursArray){
  var listItems = [];
  for (var i = 0; i < hoursArray.length; i++){
    listItems.push(hoursArray[i].join(': ') + ' cookies');
  }
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
  randomCustomers: function(){
    return randomCustomerGeneratior(this.min_customer_hr, this.max_customer_hr);
  },
  create_shop_hrs_cookies: function (){
    var cookieData = createCookiesHours(this.hour_open, this.hour_close, this.avg_cookies_hr, this);
    this.shop_hrs_cookies = cookieData[0];
    this.totalCookies = cookieData[1];
  },
  create_list: function(){
    this.ul = buildList(this.shop_hrs_cookies);
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
    this.ul = buildList(this.shop_hrs_cookies);
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
    this.ul = buildList(this.shop_hrs_cookies);
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
    this.ul = buildList(this.shop_hrs_cookies);
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
    this.ul = buildList(this.shop_hrs_cookies);
  }
};

var shops = [shop_1, shop_2, shop_3, shop_4, shop_5];

for (var i = 0; i < shops.length; i++){
  shops[i].create_shop_hrs_cookies();
  shops[i].create_list();
  var section = document.createElement('section');
  var shop_location_tag = 'p';
  var shop_location = '<' + shop_location_tag + '>' + shops[i].shopLocation + '</' + shop_location_tag + '>';
  section.innerHTML = shop_location + shops[i].ul;
  document.body.appendChild(section);
}

console.log('shops: ',shops);
