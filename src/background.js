const fedSources = require('./lib/fedSources');
const _ = require('underscore');
const appendPayload = require('./lib/appendPayload');
const renderBadge = require('./lib/renderBadge');
const messageListener = require('./lib/messageListener');
const MENU = require('./menu');
const getConfig = require('./lib/getConfig');

/**
 * 注册数据源
 * @param category
 * @param source
 */
const registerSources = (category, source) => {
  source.on('items', items => {
    MENU[category].options = items;
    render();
  });
};

/**
 * 初始化
 */
const initialize = () => {
  registerSources('fed', fedSources);
  appendPayload('fed', 'debug');
  messageListener();
};

/**
 * 渲染菜单
 */
const render = () => {
  const config = getConfig();
  // 清空所有菜单
  chrome.contextMenus.removeAll();

  renderBadge();
  Object.keys(MENU).forEach(category => {
    const {
      title,
      contexts,
      options = [],
      urls = []
    } = MENU[category];

    // 创建根菜单
    chrome.contextMenus.create({
      id: category,
      title,
      contexts
    });

    const currentValue = config.category;
    options.forEach(option => {
      // 创建子菜单
      chrome.contextMenus.create({
        type: 'radio',
        id: `${category}-${option}`,
        title: option,
        checked: currentValue === option,
        parentId: category,
        contexts,
        onclick: () => {
          localStorage.setItem(category, option);
          renderBadge();
        }
      });
    });

    urls.forEach(option => {
      // 创建子菜单
      chrome.contextMenus.create({
        id: `${category}-${option.href}`,
        title: option.text,
        parentId: category,
        contexts,
        onclick: () => {
          chrome.tabs.create({
            url: option.href
          });
        }
      });
    });


  });
}

chrome.contextMenus.onClicked.addListener(function () {
  console.log(arguments);
});

initialize();
