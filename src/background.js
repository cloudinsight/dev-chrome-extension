import {parse} from 'url';
import Wilddog from 'wilddog';
import moment from 'moment';
import ga from './ga';

ga();
moment.locale('zh-cn');

const ref = new Wilddog('https://h0r0rop9h6vu9k8oxge5.wilddogio.com/versions');
const filter = {
  urls: [
    "*://cloud.oneapm.com/*",
    "*://*.cloudinsight.cc/*"
  ]
};
const spec = ['requestHeaders', "blocking"];
const CHOOSE_FED = 'choose_fed_version';
const LOCAL = '127.0.0.1:8000';

let versionsMap = {};
const syncContextMenus = () => {
  ga({
    t: 'event',
    ec: 'contextMenu',
    ea: 'sync'
  });
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
  ga({
    t: 'event',
    ec: 'wilddog',
    ea: 'value'
  });
  versionsMap = snapshot.val();
  syncContextMenus();
});

ref.on('child_added', (snapshot) => {
  const newNode = snapshot.val();
  // 如果是 1 小时之内的新版本就显示一个提示
  if (Date.now() - newNode.BUILD_TIME < 3600000) {

    const title = `新版本 #${newNode.BUILD_ID}`;

    ga({
      t: 'event',
      ec: 'notifications',
      ea: 'create',
      el: title
    });

    chrome.notifications.create({
      type: 'basic',
      title,
      message: newNode.GIT_BRANCH,
      contextMessage: moment(newNode.BUILD_TIME).fromNow(),
      iconUrl: 'notification.png'
    })
  }
});

chrome.webRequest.onBeforeSendHeaders.addListener(detail => {
  const fed = localStorage['fed'];
  if (fed && fed.length) {
    ga({
      t: 'event',
      ec: 'setRequestHeader',
      ea: 'fed',
      el: fed
    });

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
  const target = versionsMap[info.menuItemId];

  ga({
    t: 'event',
    ec: 'contextMenu',
    ea: 'click',
    el: (target && target.URL ) || info.menuItemId
  });

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

