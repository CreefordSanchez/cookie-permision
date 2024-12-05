'use strict';

function select(selector) {
  return document.querySelector(selector);
}

function selectAll(selector) {
  return document.querySelectorAll(selector);
}

function listen(selector, event, callBack) {
  return selector.addEventListener(event, callBack);
}

function style(selector, type, value) {
  return selector.style[type] = value;
}

const menu = select('.cookie-menu');
const cookieContainer = select('.cookie-box-container');

// buttons
const settingBtn = select('.settings');
const saveBtn = select('.save-setting');
const toggleBtn = selectAll('.slider');
const acceptBtn = select('.accept');

// settings 
const circle = selectAll('.circle');
const cookieBox = select('.cookie-box');
const settings = select('.cookie-settings');
const permision = {
  printBrowser: false, printSystem: false,
  printWidth: false, printHeight: false
}

const value = Object.values(permision);
const keys = Object.keys(permision);
const browsers = ['chrome', 'firefox', 'safari', 'edge']; 

listen(settingBtn, 'click', () => {
  style(menu, 'display', 'none');
  style(settings, 'display', 'grid');
});

listen(saveBtn, 'click', () => {  
  style(cookieContainer, 'display', 'none');
  getCookie();

  if (document.cookie === '') {
    console.log('cookies not found');
  }
});

listen(acceptBtn, 'click', () => {
  style(cookieContainer, 'display', 'none');
  for (let key in permision) {
    if (permision.hasOwnProperty(key)) { 
      permision[key] = true;
    }
  }
  getCookie();
});

listen(window, 'load', () => {
  if (document.cookie !== '') {    
    style(cookieContainer, 'display', 'none');
  }
});

toggleBtn.forEach((slider, index) => {
  listen(slider, 'click', () => {    
    circle[index].classList.toggle('to-right');
    permision[keys[index]] = !value[index];
    value[index] = !value[index]
  });
});

// Finding Website, System, and size
const websiteList = [
  { alt1: 'edge', alt2: 'edg', name: 'Edge' },
  { alt1: 'opr', alt2: 'opera', name: 'Opera' },
  { alt1: 'msie', alt2: 'trident', name: 'Internet Explorer' },
  { alt1: 'firefox', alt2: 'firefox', name: 'Firefox'},
  { 
    alt1: 'chrome', alt2: '', name: 'Chrome', 
    exclude1: 'opr opera', exclude2: 'edge edg'
  },
  {
    alt1: 'safari', alt2: '', name: 'Safari', 
    exclude1: 'chrome chrome', exclude2: 'chrome chrome'
  }
];
const systemList = [
  { match: 'win', name: 'Windows' },
  { match: 'mac', name: 'MacOS' },
  { match: 'linux', name: 'Linux' },
  { match: '',  find: 'android', name: 'Android'},
  { match: '',  find: 'iphone|ipad|ipod', name: 'IOS'}
]

function getBrowser() {  
  const userAgent = navigator.userAgent.toLowerCase();

  for (const browser of websiteList) {
    if (browser.alt2 === '') {
      if (chromeAndSafari(browser, userAgent) != '') {
        return chromeAndSafari(browser, userAgent);
      } 
    }

    if (userAgent.includes(browser.alt1) || userAgent.includes(browser.alt2) 
      && browser.alt2 !== '') {
      return browser.name;
    }
  }

  return 'unknown';
}

function chromeAndSafari(browser, userAgent) {
  let exclude1 = browser.exclude1.split(' ');
  let exclude2 = browser.exclude2.split(' ');
  
  if (
    userAgent.includes(browser.alt1) && 
    (!userAgent.includes(exclude1[0]) || !userAgent.includes(exclude1[0])) &&
    (!userAgent.includes(exclude2[0]) || !userAgent.includes(exclude2[0]))
  ) {
    return browser.name;
  } 
  return '';
}

function getOS() {
  const platform = navigator.platform.toLowerCase();
  const userAgent = navigator.userAgent.toLowerCase();
  
  for (const system of systemList) {
    if (system.match === '') {
      const testing = new RegExp(system.find);
      if (testing.test(userAgent)) return system.name;
    }

    if (platform.includes(system.match)) return system.name;
  }

  return 'unknown';
}

function getHeight() {
  return window.innerHeight;
}

function getWidth() {
  return window.innerWidth;
}

//setting the cookie
function getCookie() {
  setCookie();
  console.log(document.cookie);
}
function setCookie() {
  let settingCookie = '';

  if (permision.printBrowser) {
    settingCookie += `${getBrowser()} `;
    document.cookie = `Browser=${getBrowser()}; expires=${getExpires()}; path=/`;
  }

  if (permision.printSystem) {
    settingCookie += `${getOS()} `;
    document.cookie = `System=${getOS()}; expires=${getExpires()}; path=/`;
  }

  if (permision.printWidth) {
    settingCookie += `${getWidth()}px `;
    document.cookie = `Width=${getWidth()}px; expires=${getExpires()}; path=/`;
  }

  if (permision.printHeight) {
    settingCookie += `${getHeight()}px `;
    document.cookie = `Height=${getHeight()}px; expires=${getExpires()}; path=/`;
  }
}

function getExpires() {
  const date = new Date();
  date.setTime(date.getTime() + (15 * 1000)); 
 return date.toUTCString();
}