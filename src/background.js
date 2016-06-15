import { parse } from 'url';
import Wilddog from 'wilddog';
const ref = new Wilddog('https://h0r0rop9h6vu9k8oxge5.wilddogio.com/versions');
const filter = {
  urls: [
    "*://cloud.oneapm.com/*"
  ]
};
const spec = ['requestHeaders', "blocking"];
const CHOOSE_FED = 'choose_fed_version';
const LOCAL = '127.0.0.1:8000';

let versionsMap = {};
const syncContextMenus = () => {
  chrome.contextMenus.removeAll(()=> {

    const currentFed = localStorage['fed'];

    if (currentFed === LOCAL) {
      chrome.browserAction.setBadgeText({
        text: 'dev'
      })
    } else {
      chrome.browserAction.setBadgeText({
        text: ''
      })
    }

    chrome.contextMenus.create({
      id: CHOOSE_FED,
      title: '选择前端版本',
      contexts: ['browser_action']
    });

    chrome.contextMenus.create({
      type: 'radio',
      id: 'none',
      title: 'default',
      contexts: ['browser_action'],
      parentId: CHOOSE_FED,
      checked: !currentFed
    });

    chrome.contextMenus.create({
      type: 'radio',
      id: 'dev',
      title: LOCAL,
      contexts: ['browser_action'],
      parentId: CHOOSE_FED,
      checked: currentFed === LOCAL
    });

    Object.keys(versionsMap).forEach(id => {
      chrome.contextMenus.create({
        type: 'radio',
        id,
        title: versionsMap[id].URL,
        contexts: ['browser_action'],
        parentId: CHOOSE_FED,
        checked: currentFed === versionsMap[id].URL
      });
      if (currentFed === versionsMap[id].URL) {
        chrome.browserAction.setBadgeText({
          text: versionsMap[id].BUILD_ID
        })
      }
    });
  })
};

ref.on('value', (snapshot) => {
  versionsMap = snapshot.val();
  syncContextMenus();
});

chrome.webRequest.onBeforeSendHeaders.addListener(detail => {
  const fed = localStorage['fed'];
  if (fed && fed.length) {
    detail.requestHeaders.push({
      name: 'fed',
      value: fed
    });
  }
  return {
    requestHeaders: detail.requestHeaders
  }
}, filter, spec);

chrome.contextMenus.onClicked.addListener((info, tabs) => {
  switch (info.menuItemId) {
    case 'none':
      delete localStorage.fed;
      delete localStorage.description;
      break;
    case 'dev':
      localStorage.fed = LOCAL;
      delete localStorage.description;
      break;
    default:
      const target = versionsMap[info.menuItemId];
      if (target) {
        localStorage.fed = target.URL;
        localStorage.description = JSON.stringify(target);
      } else {
        console.info('%s has no target', info.menuItemId);
        return;
      }
  }
  syncContextMenus();
  if (parse(tabs.url).hostname === 'cloud.oneapm.com') {
    chrome.tabs.reload(tabs.id);
  }
});

