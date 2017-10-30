'use strict';

var admin_login = document.getElementById('admin_login');
var admin_link = document.getElementById('admin_link');
var admin_submit_btn = document.getElementById('admin_submit_btn');
var admin_cancel_btn = document.getElementById('admin_cancel_btn');
var about = document.getElementsByClassName('about')[0];
var about_toggle = document.getElementById('about_toggle');
var home = document.getElementById('home');
var store_locations = document.getElementById('store_locations');


console.log('about', about);

admin_link.addEventListener('click', open_admin_login);
admin_cancel_btn.addEventListener('click', close_admin_login);
admin_submit_btn.addEventListener('click', login_admin);
about_toggle.addEventListener('click', toggle_about);
home.addEventListener('click', toggle_home);

var store_locations_section = store_locations;
buildStoreHours(store_locations_section);

function open_admin_login(e){
  console.log(e);
  e.preventDefault();
  console.log('admin_login: ', admin_login);
  var visible_section = document.getElementsByClassName('section_active')[0];
  visible_section.classList.toggle('section_active');
  admin_login.classList.toggle('section_active');
}

function close_admin_login(e){
  e.preventDefault();
  var visible_section = document.getElementsByClassName('section_active')[0];
  visible_section.classList.toggle('section_active');
  admin_login.classList.remove('section_active');
}

function login_admin(e){
  e.preventDefault();
  //  admin_login.classList.remove('admin_active');
  document.getElementById('hidden_admin_link').click();

  console.log(window.location );
}

function toggle_about(e){
  e.preventDefault();
  console.log(e);
  var visible_section = document.getElementsByClassName('section_active')[0];
  visible_section.classList.toggle('section_active');
  about.classList.toggle('section_active');
}

function toggle_home(e){
  e.preventDefault();
  var visible_section = document.getElementsByClassName('section_active')[0];
  visible_section.classList.toggle('section_active');
  store_locations.classList.toggle('section_active');
}


function buildStoreHours(store_locations_section){
  var shops = [{shopLocation:'1st and Pike', open: '6am', close:'7pm'},
    {shopLocation:'SeaTac Airport', open: '6am', close:'8pm'},
    {shopLocation:'Seattle Center', open: '8am', close:'6pm'}];

  var locations = [];
  for (var i = 0; i < shops.length; i++){
    locations.push('<span>' + shops[i].shopLocation + '</span><span class="open-hour">' + shops[i].open + '</span><span>' + shops[i].close + '</span>');
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
