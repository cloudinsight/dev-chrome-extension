import $ from 'jquery';
import uuid from 'uuid';

const details = chrome.app.getDetails();
const tid = 'UA-79575996-6';
const url = 'http://www.google-analytics.com/collect';

/**
 * Google Analytics Measurement Protocol 的简易地封装
 *
 * @todo 从 Cookie 里获得 userid
 *
 * @param options
 */
const ga = (options = {}) => {

  // 读取本地存储的 CID
  chrome.storage.local.get('cid', ({
    cid = uuid.v4()
  }) => {
    const {
      t = 'screenview',
      ...others
    } = options;

    $.post(url, {
      v: 1,  // 版本
      tid, // UA Property ID
      t, // hit
      an: details.name, // application name
      aid: details.id, // application id
      av: details.version, // application version
      cd: window.location.pathname, // current screen
      ul: chrome.i18n.getUILanguage(), // language
      cid,
      ...others
    });

    // 设置 CID
    chrome.storage.local.set({
      cid
    });
  });

}

export default ga;