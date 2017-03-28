const FILTER = {
  urls: [
    "*://cloud.oneapm.com/*",
    "*://*.cloudinsight.cc/*"
  ]
};
const SPEC = ['requestHeaders', "blocking"];
const onBeforeSendHeaders = chrome.webRequest.onBeforeSendHeaders;
const getConfig = require('./getConfig');
const menu = require('../menu');

/**
 * @param keys 要添加的头部名称
 */
const appendPayload = (...keys) => {
  onBeforeSendHeaders.addListener(detail => {
    const config = getConfig();
    keys.forEach(name => {
      const value = config[name];
      detail.requestHeaders.push({
        name: `X-CONFIG-${name.toUpperCase()}`,
        value
      });
      if (name === 'fed' && value !== menu.fed.defaultValue) {
        detail.requestHeaders.push({
          name: 'fed',
          value
        });
      }
    });
    return {
      requestHeaders: detail.requestHeaders
    }
  }, FILTER, SPEC);
}

module.exports = appendPayload;

